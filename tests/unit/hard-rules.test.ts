import { describe, it, expect } from 'vitest';
import {
  classifyPath, isTextFile, scopesFor, scanText, parseDenylist, countAllowMarkers, checkFileName,
  type Rule,
} from '../../src/lib/hard-rules.ts';
import { PUBLIC_RULES } from '../../scripts/hard-rules/patterns.ts';

const byId = (id: string): Rule => {
  const r = PUBLIC_RULES.find((x) => x.id === id);
  if (!r) throw new Error(`no rule ${id}`);
  return r;
};

describe('classifyPath', () => {
  it('classifies prose, code, built html and excluded files', () => {
    expect(classifyPath('docs/plan/01-plan.md')).toBe('docs');
    expect(classifyPath('README.md')).toBe('docs');
    expect(classifyPath('src/content/press/a.md')).toBe('docs');
    expect(classifyPath('src/pages/index.astro')).toBe('all');
    expect(classifyPath('tests/e2e/x.spec.ts')).toBe('all');
    expect(classifyPath('dist/work/index.html')).toBe('dist');
    expect(classifyPath('dist/_astro/x.js')).toBeNull();
    expect(classifyPath('node_modules/x/y.js')).toBeNull();
    expect(classifyPath('scripts/hard-rules/patterns.ts')).toBeNull();
    expect(classifyPath('scripts/check-trailers.ts')).toBeNull();
    expect(classifyPath('src/lib/trailers.ts')).toBeNull();
    expect(classifyPath('other/thing.md')).toBeNull();
  });
  it('accepts backslash paths', () => {
    expect(classifyPath('docs\\plan\\x.md')).toBe('docs');
  });
});

describe('isTextFile / scopesFor', () => {
  it('recognises text extensions and dotfiles', () => {
    expect(isTextFile('a.md')).toBe(true);
    expect(isTextFile('a.astro')).toBe(true);
    expect(isTextFile('.lycheeignore')).toBe(true);
    expect(isTextFile('LICENSE')).toBe(true);
    expect(isTextFile('a.png')).toBe(false);
  });
  it('maps file scopes to applicable rule scopes', () => {
    expect(scopesFor('docs')).toEqual(['all', 'docs']);
    expect(scopesFor('dist')).toEqual(['all', 'dist']);
    expect(scopesFor('all')).toEqual(['all']);
  });
});

describe('scanText with the public rules', () => {
  const opts = { file: 'docs/x.md', fileScope: 'docs' as const };

  it('catches an Irish international phone number anywhere', () => {
    const hits = scanText('call +353 89 123 4567 now', [byId('phone-ie-intl')], { file: 'src/x.ts', fileScope: 'all' });
    expect(hits.map((h) => h.id)).toEqual(['phone-ie-intl']);
    expect(hits[0].line).toBe(1);
  });
  it('catches the authorship ratio and the spelled-out form in prose', () => {
    expect(scanText('about 71% of commits', [byId('ratio-71-percent')], opts)).toHaveLength(1);
    expect(scanText('seventy-one percent', [byId('ratio-seventy-one')], opts)).toHaveLength(1);
    expect(scanText('commit 71 of 200', [byId('ratio-71-percent')], opts)).toHaveLength(0);
  });
  it('does not apply prose-only rules to code files', () => {
    expect(scanText('const n = 71 // commits', [byId('ratio-71-context')], { file: 'src/x.ts', fileScope: 'all' })).toHaveLength(0);
  });
  it('catches local paths and session pointers', () => {
    expect(scanText('see F:\\\\stuff\\\\x', [byId('drive-letter-path')], opts)).toHaveLength(1);
    expect(scanText('https://example.com/x', [byId('drive-letter-path')], opts)).toHaveLength(0);
    expect(scanText('/home/someone/dir', [byId('home-path')], opts)).toHaveLength(1);
    expect(scanText('Claude-Session: x', [byId('session-pointer')], opts)).toHaveLength(1);
  });
  it('catches the wrong programme name but not the right one', () => {
    expect(scanText('a Claude Code Ambassador', [byId('programme-name')], opts)).toHaveLength(1);
    expect(scanText('a Claude Community Ambassador', [byId('programme-name')], opts)).toHaveLength(0);
  });
  it('catches third-party scripts in built html but not own-origin ones', () => {
    const d = { file: 'dist/x.html', fileScope: 'dist' as const };
    expect(scanText('<script src="https://cdn.example.com/x.js"></script>', [byId('third-party-script')], d)).toHaveLength(1);
    expect(scanText('<script src="https://edward-vj.github.io/_astro/x.js"></script>', [byId('third-party-script')], d)).toHaveLength(0);
    expect(scanText('<script src="/_astro/x.js"></script>', [byId('third-party-script')], d)).toHaveLength(0);
  });
  it('catches branding in alt text', () => {
    const d = { file: 'dist/x.html', fileScope: 'dist' as const };
    expect(scanText('<img alt="Claude logo">', [byId('branding-alt')], d)).toHaveLength(1);
  });
  it('honours an allow marker for the named rule only', () => {
    const rules = [byId('ratio-71-percent'), byId('phone-ie-intl')];
    const text = '71% <!-- hard-rules: allow ratio-71-percent example -->';
    expect(scanText(text, rules, opts).map((h) => h.id)).toEqual([]);
    const text2 = '71% and +353 89 123 4567 <!-- hard-rules: allow ratio-71-percent -->';
    expect(scanText(text2, rules, opts).map((h) => h.id)).toEqual(['phone-ie-intl']);
    expect(scanText('71% <!-- hard-rules: allow * -->', rules, opts)).toHaveLength(0);
  });
  it('returns nothing when no rule applies to the scope', () => {
    expect(scanText('anything', [byId('third-party-script')], opts)).toEqual([]);
  });
});

describe('parseDenylist', () => {
  it('skips blank lines and comments, builds case-insensitive rules', () => {
    const rules = parseDenylist('# c\n\nfoo|bar\n  baz  \n');
    expect(rules).toHaveLength(2);
    expect(rules[0].id).toBe('denylist-1');
    expect(scanText('FOO here', rules, { file: 'src/x.ts', fileScope: 'all' })).toHaveLength(1);
    expect(scanText('nothing', rules, { file: 'src/x.ts', fileScope: 'all' })).toHaveLength(0);
  });
  it('returns nothing for an unset secret', () => {
    expect(parseDenylist(undefined)).toEqual([]);
    expect(parseDenylist('')).toEqual([]);
  });
});

describe('countAllowMarkers / checkFileName', () => {
  it('counts markers', () => {
    expect(countAllowMarkers('a\nhard-rules: allow x\nhard-rules: allow y')).toBe(2);
    expect(countAllowMarkers('none')).toBe(0);
  });
  it('flags model files and branding assets by name', () => {
    expect(checkFileName('public/model.onnx').map((h) => h.id)).toEqual(['model-file']);
    expect(checkFileName('src/assets/claude-logo.svg').map((h) => h.id)).toEqual(['branding-asset']);
    expect(checkFileName('src/assets/photo.jpg')).toEqual([]);
  });
});
