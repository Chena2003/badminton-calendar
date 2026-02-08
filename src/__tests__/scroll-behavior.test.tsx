import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Scroll behavior CSS fix', () => {
  let cssContent: string;

  beforeAll(() => {
    cssContent = readFileSync(
      resolve(__dirname, '../app/[locale]/globals.css'),
      'utf-8',
    );
  });

  it('body::before should use z-index: -1 instead of z-index: 1', () => {
    // Extract body::before block
    const beforeMatch = cssContent.match(/body::before\s*\{([^}]+)\}/);
    expect(beforeMatch).toBeTruthy();

    const beforeBlock = beforeMatch![1];
    expect(beforeBlock).toContain('z-index: -1');
    expect(beforeBlock).not.toContain('z-index: 1;');
  });

  it('body > * should not have position: relative rule', () => {
    // There should be no body > * rule block
    const bodyChildRule = cssContent.match(/body\s*>\s*\*\s*\{/);
    expect(bodyChildRule).toBeNull();
  });

  it('body should not have position: relative or z-index: 0', () => {
    // Extract body block (not body::before)
    const bodyMatch = cssContent.match(/body\s*\{([^}]+)\}/);
    expect(bodyMatch).toBeTruthy();

    const bodyBlock = bodyMatch![1];
    expect(bodyBlock).not.toContain('position: relative');
    expect(bodyBlock).not.toContain('z-index: 0');
  });

  it('body::before should use height: 100% instead of 100vh', () => {
    const beforeMatch = cssContent.match(/body::before\s*\{([^}]+)\}/);
    expect(beforeMatch).toBeTruthy();

    const beforeBlock = beforeMatch![1];
    expect(beforeBlock).toContain('height: 100%');
    expect(beforeBlock).not.toContain('height: 100vh');
  });
});
