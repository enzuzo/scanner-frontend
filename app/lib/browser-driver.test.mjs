import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveBrowserDriver } from './browser-driver.js';

test('resolveBrowserDriver: undefined by default (no env set)', () => {
    assert.equal(resolveBrowserDriver({}), undefined);
});

test('resolveBrowserDriver: "patchright" when explicitly configured', () => {
    assert.equal(resolveBrowserDriver({ SCANNER_BROWSER_DRIVER: 'patchright' }), 'patchright');
});

test('resolveBrowserDriver: undefined for "playwright" (the implicit default, never sent)', () => {
    assert.equal(resolveBrowserDriver({ SCANNER_BROWSER_DRIVER: 'playwright' }), undefined);
});

test('resolveBrowserDriver: undefined for any unrecognized value', () => {
    assert.equal(resolveBrowserDriver({ SCANNER_BROWSER_DRIVER: 'chromium' }), undefined);
});
