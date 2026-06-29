import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEmails, hasSpaceSeparator } from './email-utils.js';

// parseEmails

test('parseEmails splits a single email', () => {
    assert.deepEqual(parseEmails('foo@bar.com'), ['foo@bar.com']);
});

test('parseEmails splits comma-only separated emails', () => {
    assert.deepEqual(parseEmails('foo1@bar.com,foo2@bar.com'), ['foo1@bar.com', 'foo2@bar.com']);
});

test('parseEmails splits comma+space separated emails', () => {
    assert.deepEqual(parseEmails('foo1@bar.com, foo2@bar.com'), ['foo1@bar.com', 'foo2@bar.com']);
});

test('parseEmails trims extra whitespace around entries', () => {
    assert.deepEqual(parseEmails('  foo1@bar.com ,  foo2@bar.com  '), ['foo1@bar.com', 'foo2@bar.com']);
});

test('parseEmails ignores empty entries from trailing commas', () => {
    assert.deepEqual(parseEmails('foo@bar.com,'), ['foo@bar.com']);
});

// hasSpaceSeparator

test('hasSpaceSeparator returns false for a single email', () => {
    assert.equal(hasSpaceSeparator('foo@bar.com'), false);
});

test('hasSpaceSeparator returns false for comma-only separator', () => {
    assert.equal(hasSpaceSeparator('foo1@bar.com,foo2@bar.com'), false);
});

test('hasSpaceSeparator returns false for comma+space separator', () => {
    assert.equal(hasSpaceSeparator('foo1@bar.com, foo2@bar.com'), false);
});

test('hasSpaceSeparator returns true when space is used as separator', () => {
    assert.equal(hasSpaceSeparator('foo1@bar.com foo2@bar.com'), true);
});

test('hasSpaceSeparator returns true for mixed space and comma separators', () => {
    assert.equal(hasSpaceSeparator('foo1@bar.com, foo2@bar.com foo3@bar.com'), true);
});
