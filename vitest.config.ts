/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    reporters: ['default', ['json', { outputFile: 'coverage/vitest-results.json' }]],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/lib/**/*.ts'],
      thresholds: { lines: 90, functions: 90, branches: 80 },
    },
  },
});
