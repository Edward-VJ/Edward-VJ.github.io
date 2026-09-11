/**
 * Start `astro preview` in the FOREGROUND for the test suites.
 *
 * Astro 7 auto-detects an AI-agent environment and daemonises the preview server, which makes
 * Playwright's webServer think the process exited early and leaves a lock in .astro/preview.json
 * that blocks the next start. Setting ASTRO_PREVIEW_BACKGROUND disables that detection (it is the
 * variable Astro sets on its own foreground child), and --ignore-lock skips the lock file.
 */
import { rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

for (const f of ['.astro/preview.json', '.astro/preview.log']) rmSync(f, { force: true });

const astroBin = join(process.cwd(), 'node_modules', 'astro', 'bin', 'astro.mjs');

const child = spawn(
  process.execPath,
  [astroBin, 'preview', '--host', '127.0.0.1', '--port', '4321', '--ignore-lock'],
  { stdio: 'inherit', env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '1' } },
);
child.on('exit', (code) => process.exit(code ?? 1));
process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
