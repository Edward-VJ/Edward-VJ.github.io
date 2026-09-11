/**
 * Pure helpers for generating the Lighthouse CI URL list from the built sitemap.
 * The script in scripts/lhci-urls.ts is a thin wrapper; the logic lives here so it is unit-tested.
 */

/** Extract every <loc> from a sitemap XML string and return the site-relative paths, sorted, unique. */
export function parseSitemapPaths(xml: string): string[] {
  const paths = new Set<string>();
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1];
    let path: string;
    try {
      path = new URL(loc).pathname;
    } catch {
      path = loc.startsWith('/') ? loc : `/${loc}`;
    }
    paths.add(path);
  }
  return [...paths].sort();
}

/**
 * Turn site-relative paths into URLs for LHCI's static server.
 * Directory paths become `<base>/<dir>/index.html`; file paths are kept as-is.
 */
export function lhciUrlsFromPaths(
  paths: readonly string[],
  extra: readonly string[] = ['/404.html'],
  base: string = 'http://localhost',
): string[] {
  const all = [...new Set([...paths, ...extra])].sort();
  return all.map((p) => {
    const clean = p.startsWith('/') ? p : `/${p}`;
    if (/\.[a-z0-9]+$/i.test(clean)) return `${base}${clean}`;
    const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
    return `${base}${withSlash}index.html`;
  });
}

export interface LhciConfig {
  ci: {
    collect: { staticDistDir: string; url: string[]; numberOfRuns: number; settings: { preset?: string } };
    assert: { assertions: Record<string, [string, Record<string, unknown>]> };
    upload: { target: string };
  };
}

/** Build the lighthouserc object. `preset` is undefined for mobile (Lighthouse default) or 'desktop'. */
export function buildLhciConfig(urls: readonly string[], preset?: 'desktop'): LhciConfig {
  const assertion = (min: number): [string, Record<string, unknown>] => [
    'error',
    { minScore: min, aggregationMethod: 'median-run' },
  ];
  return {
    ci: {
      collect: {
        staticDistDir: './dist',
        url: [...urls],
        numberOfRuns: 3,
        settings: preset ? { preset } : {},
      },
      assert: {
        assertions: {
          'categories:performance': assertion(0.95),
          'categories:accessibility': assertion(0.95),
          'categories:best-practices': assertion(0.95),
          'categories:seo': assertion(0.95),
        },
      },
      upload: { target: 'filesystem' },
    },
  };
}
