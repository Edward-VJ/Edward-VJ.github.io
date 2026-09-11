/**
 * Gate G7 — local SonarQube scan via the official scanner container.
 * Usage: SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=... node scripts/sonar.ts
 * Runs vitest coverage first so lcov exists, then the scanner with quality-gate wait.
 */
import { execFileSync, spawnSync } from 'node:child_process';

const host = process.env.SONAR_HOST_URL;
const token = process.env.SONAR_TOKEN;
if (!host || !token) { console.error('sonar: SONAR_HOST_URL and SONAR_TOKEN must be set (see the private plan directory)'); process.exit(1); }

// Inside the scanner container "localhost" is the container, not the host.
const hostForContainer = host.replace('localhost', 'host.docker.internal').replace('127.0.0.1', 'host.docker.internal');

let branch = 'unknown';
try { branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* ignore */ }

console.log('sonar: running unit tests with coverage');
const test = spawnSync('npm', ['test'], { stdio: 'inherit', shell: true });
if (test.status !== 0) process.exit(test.status ?? 1);

console.log(`sonar: scanning branch ${branch} against ${host}`);
const args = [
  'run', '--rm',
  '-e', `SONAR_HOST_URL=${hostForContainer}`,
  '-e', `SONAR_TOKEN=${token}`,
  '-v', `${process.cwd()}:/usr/src`,
  'sonarsource/sonar-scanner-cli',
];
const scan = spawnSync('docker', args, { stdio: 'inherit', shell: true });
process.exit(scan.status ?? 1);
