import test from 'node:test';
import assert from 'node:assert/strict';
import { isLocalAuthBypassEnabled } from './auth-bypass.js';

test('isLocalAuthBypassEnabled: false by default (no env set)', () => {
    assert.equal(isLocalAuthBypassEnabled({}), false);
});

test('isLocalAuthBypassEnabled: true when explicitly enabled outside production', () => {
    assert.equal(isLocalAuthBypassEnabled({ LOCAL_AUTH_BYPASS: 'true', NODE_ENV: 'development' }), true);
});

test('isLocalAuthBypassEnabled: false when NODE_ENV is production, even if set', () => {
    assert.equal(isLocalAuthBypassEnabled({ LOCAL_AUTH_BYPASS: 'true', NODE_ENV: 'production' }), false);
});

test('isLocalAuthBypassEnabled: false for any value other than the literal string "true"', () => {
    assert.equal(isLocalAuthBypassEnabled({ LOCAL_AUTH_BYPASS: '1', NODE_ENV: 'development' }), false);
    assert.equal(isLocalAuthBypassEnabled({ LOCAL_AUTH_BYPASS: 'yes', NODE_ENV: 'development' }), false);
});
