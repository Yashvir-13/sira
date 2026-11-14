import test from 'node:test';
import assert from 'node:assert';

test('Theme resolution defaults to dark or stored preference', () => {
  const getInitialTheme = (stored: string | null, prefersDark: boolean): 'light' | 'dark' => {
    if (stored === 'light' || stored === 'dark') return stored;
    return prefersDark ? 'dark' : 'light';
  };

  assert.strictEqual(getInitialTheme('light', true), 'light');
  assert.strictEqual(getInitialTheme('dark', false), 'dark');
  assert.strictEqual(getInitialTheme(null, true), 'dark');
  assert.strictEqual(getInitialTheme(null, false), 'light');
});
