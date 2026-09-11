/**
 * Start `astro preview` for the test suites, removing any stale preview lock first.
 * Astro writes .astro/preview.json with the server PID; a lock left behind by another
 * environment (a container, a killed process) otherwise blocks the next start.
 */
import { rmSync } from 'node:fs';
import { spawn } from 'node:child_process';

for (const f of ['.astro/preview.json', '.astro/preview.log']) rmSync(f, { force: true });

const child = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', '4321'], {
  stdio: 'inherit',
  shell: true,
});
child.on('exit', (code) => process.exit(code ?? 1));
process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
