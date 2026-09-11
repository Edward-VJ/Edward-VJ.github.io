import { describe, it, expect } from 'vitest';
import { parseTrailers, checkCommitMessage, checkPrTitle, splitGitLog } from '../../src/lib/trailers.ts';

const good = `PS-1: scaffold and gates

Body text.

Plan-Step: PS-1
Sign-off: PS-1.1, PS-1.2
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
`;

describe('parseTrailers', () => {
  it('reads Key: value lines anywhere in the message', () => {
    const t = parseTrailers(good);
    expect(t.get('Plan-Step')).toBe('PS-1');
    expect(t.get('Sign-off')).toBe('PS-1.1, PS-1.2');
    expect(t.has('Co-Authored-By')).toBe(true);
  });
});

describe('checkCommitMessage', () => {
  it('passes a complete message', () => {
    expect(checkCommitMessage(good)).toEqual([]);
  });
  it('reports every missing trailer', () => {
    const problems = checkCommitMessage('just a subject');
    expect(problems).toHaveLength(3);
    expect(problems.join(' ')).toContain('Plan-Step');
    expect(problems.join(' ')).toContain('Sign-off');
    expect(problems.join(' ')).toContain('Co-Authored-By');
  });
  it('rejects the session trailer', () => {
    const problems = checkCommitMessage(good + 'Claude-Session: https://example.invalid/s\n');
    expect(problems).toEqual(['forbidden trailer "Claude-Session"']);
  });
  it('rejects an empty required value and a malformed step', () => {
    expect(checkCommitMessage(good.replace('Sign-off: PS-1.1, PS-1.2', 'Sign-off: '))).toEqual(['missing trailer "Sign-off"']);
    expect(checkCommitMessage(good.replace('Plan-Step: PS-1', 'Plan-Step: step one'))[0]).toMatch(/Plan-Step must look like/);
  });
  it('accepts a lettered step id such as PS-9b', () => {
    expect(checkCommitMessage(good.replace('Plan-Step: PS-1', 'Plan-Step: PS-9b'))).toEqual([]);
  });
});

describe('checkPrTitle', () => {
  it('accepts PS-n: titles and PS-9b: titles', () => {
    expect(checkPrTitle('PS-3: read pages')).toEqual([]);
    expect(checkPrTitle('PS-9b: close-out')).toEqual([]);
  });
  it('rejects anything else', () => {
    expect(checkPrTitle('read pages')).toHaveLength(1);
    expect(checkPrTitle('PS-3 read pages')).toHaveLength(1);
    expect(checkPrTitle('PS-3:')).toHaveLength(1);
  });
});

describe('splitGitLog', () => {
  it('splits sha/message chunks and tolerates a trailing separator', () => {
    const out = 'abc\nsubject\n\nPlan-Step: PS-1\n==END==\ndef\nother\n==END==\n';
    expect(splitGitLog(out)).toEqual([
      ['abc', 'subject\n\nPlan-Step: PS-1'],
      ['def', 'other'],
    ]);
  });
  it('handles a sha with no message', () => {
    expect(splitGitLog('abc\n==END==')).toEqual([['abc', '']]);
  });
});
