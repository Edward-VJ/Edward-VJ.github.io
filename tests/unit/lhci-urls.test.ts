import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseSitemapPaths, lhciUrlsFromPaths, buildLhciConfig } from '../../src/lib/lhci-urls.ts';

const fixture = readFileSync(new URL('../fixtures/sitemap-sample.xml', import.meta.url), 'utf8');

describe('parseSitemapPaths', () => {
  it('extracts unique, sorted site-relative paths from <loc> entries', () => {
    expect(parseSitemapPaths(fixture)).toEqual(['/', '/contact/', '/play/pong/', '/work/']);
  });
  it('accepts bare paths and ignores whitespace', () => {
    expect(parseSitemapPaths('<loc> /a/ </loc><loc>b/</loc>')).toEqual(['/a/', '/b/']);
  });
  it('returns an empty list for a sitemap with no locs', () => {
    expect(parseSitemapPaths('<urlset></urlset>')).toEqual([]);
  });
});

describe('lhciUrlsFromPaths', () => {
  it('maps directories to index.html and keeps file paths, adding /404.html', () => {
    expect(lhciUrlsFromPaths(['/', '/work/'])).toEqual([
      'http://localhost/index.html',
      'http://localhost/404.html',
      'http://localhost/work/index.html',
    ]);
  });
  it('does not duplicate an extra path already present and honours a custom base', () => {
    expect(lhciUrlsFromPaths(['/404.html', 'x'], ['/404.html'], 'http://h')).toEqual([
      'http://h/404.html',
      'http://h/x/index.html',
    ]);
  });
});

describe('buildLhciConfig', () => {
  it('asserts 0.95 on the four categories with median-run aggregation', () => {
    const cfg = buildLhciConfig(['http://localhost/index.html']);
    expect(cfg.ci.collect.url).toEqual(['http://localhost/index.html']);
    expect(cfg.ci.collect.numberOfRuns).toBe(3);
    expect(cfg.ci.collect.settings).toEqual({});
    for (const key of ['categories:performance', 'categories:accessibility', 'categories:best-practices', 'categories:seo']) {
      expect(cfg.ci.assert.assertions[key]).toEqual(['error', { minScore: 0.95, aggregationMethod: 'median-run' }]);
    }
  });
  it('sets the desktop preset when asked', () => {
    expect(buildLhciConfig([], 'desktop').ci.collect.settings).toEqual({ preset: 'desktop' });
  });
});
