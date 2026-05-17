import fs from 'fs';
import path from 'path';

import { describe, expect, test } from 'vitest';

describe('metadata manifest', () => {
  test('points to a manifest file that exists in public assets', () => {
    const layoutPath = path.join(
      process.cwd(),
      'src/app/[locale]/layout.tsx',
    );
    const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
    const manifestPath = layoutSource.match(/manifest:\s*['"]([^'"]+)['"]/)?.[1];

    expect(manifestPath).toBeDefined();
    expect(
      fs.existsSync(path.join(process.cwd(), 'public', manifestPath!.slice(1))),
    ).toBe(true);
  });
});
