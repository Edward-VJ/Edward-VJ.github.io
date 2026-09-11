/**
 * Public hard-rules pattern set (gate G12). Sensitive tokens are NOT here; they live in the
 * HARD_RULES_DENYLIST repository secret. This file is excluded from its own scan.
 */
import type { Rule } from '../../src/lib/hard-rules.ts';

const r = (id: string, regex: RegExp, scope: Rule['scope'], description: string): Rule => ({ id, regex, scope, description });

export const PUBLIC_RULES: Rule[] = [
  // phone numbers
  r('phone-ie-intl', /\+353[\s\-()]*\d[\d\s\-()]{6,}\d/, 'all', 'Irish international phone number'),
  r('phone-ie-national', /\b0(8[3-9]|1|2\d|4\d|5\d|6\d|7\d|9\d)[\s\-]?\d{3}[\s\-]?\d{3,4}\b/, 'docs', 'Irish national phone number'),
  r('phone-lt-intl', /\+370[\s\-()]*\d[\d\s\-()]{6,}\d/, 'all', 'Lithuanian international phone number'),
  // postal address / Eircode (prose only; hashed asset names would false-positive in dist)
  r('eircode', /\b(D6W|[AC-FHKNPRTV-Y]\d{2})\s?[0-9AC-FHKNPRTV-Y]{4}\b/, 'docs', 'Eircode'),
  r('street-address', /\b\d{1,4}\s+[A-Z][a-z]+\s+(Road|Rd|Street|St|Avenue|Ave|Park|Drive|Lane|Court|Close|Green|Grove|Terrace|Square|Crescent)\b/, 'docs', 'street address'),
  // authorship ratio and hackathon claims
  r('ratio-71-percent', /\b71\s?(?:%|per ?cent\b|percent\b)/, 'all', 'authorship ratio figure'),
  r('ratio-71-context', /\b71\b.{0,40}(commit|co-?author|trailer|\bAI\b)/i, 'docs', 'authorship ratio figure in context'),
  r('ratio-seventy-one', /seventy[- ]one/i, 'docs', 'authorship ratio spelled out'),
  r('hackathon-claim', /13,?000|\btop[\s-]?6\b|hackathon/i, 'docs', 'third-party hackathon claim'),
  // research code described as AI-assisted (either order)
  r('ra-ai-1', /(\bRA\b|research[- ]assistant|thesis|Maynooth)[^.\n]{0,80}(AI[- ]assisted|AI[- ]written|agent[- ]written|Claude|Copilot)/i, 'docs', 'research work described as AI-assisted'),
  r('ra-ai-2', /(AI[- ]assisted|AI[- ]written|agent[- ]written|Claude|Copilot)[^.\n]{0,80}(\bRA\b|research[- ]assistant|thesis)/i, 'docs', 'research work described as AI-assisted'),
  // local paths, scratch dirs, session/artifact pointers
  r('drive-letter-path', /(?<![A-Za-z0-9])[A-Za-z]:[\\/](?!\/)/, 'all', 'Windows drive-letter path'),
  r('home-path', /\/media\/\w+\/|\/home\/\w+\/|\/Users\/\w+\/|F--jobhunting|scratchpad|~\//, 'all', 'local home or scratch path'),
  r('claude-dir', /\.claude[\\/]/, 'all', 'local Claude configuration path'),
  r('session-pointer', /claude\.ai\/code\/(session|artifact)|session_[0-9A-Za-z]{20,}|Claude-Session:/, 'all', 'session or artifact pointer'),
  // private working-copy names
  r('private-repo-names', /portfolio[_-]plan|yard-gallery-plan|jira-local|OAT_PAPER/i, 'all', 'private repository or working-copy name'),
  // wrong programme name
  r('programme-name', /Claude Code Ambassador/, 'all', 'incorrect programme name (use "Claude Community Ambassador")'),
  // unreleased data
  r('field-frames', /extracted_frames|frame_\d{5}|all_predicted_licor/, 'all', 'unreleased field-data path'),
  // third-party scripts and stylesheets in built HTML (own origin only)
  r('third-party-script', /<script[^>]+src=["']https?:\/\/(?!edward-vj\.github\.io\/)/i, 'dist', 'third-party script'),
  r('third-party-link', /<link[^>]+href=["']https?:\/\/(?!edward-vj\.github\.io\/)[^"']*/i, 'dist', 'third-party stylesheet or link'),
  r('captcha-script', /hcaptcha|web3forms\.com\/client/i, 'dist', 'captcha script (needs a docs/decisions.md entry)'),
  // branding in alt/aria text
  r('branding-alt', /(alt|aria-label)=["'][^"']*(Claude|Anthropic)/i, 'dist', 'Claude/Anthropic in image alt or aria-label'),
];
