'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const __1 = require('..');
const { describe, it } = require('mocha');
const assert = require('assert');
const fixtures = require('../ts_test/fixtures/crypto');
describe('crypto', () => {
  ['hash160', 'hash256', 'ripemd160', 'sha1', 'sha256'].forEach(algorithm => {
    describe(algorithm, () => {
      fixtures.forEach(f => {
        const fn = __1.crypto[algorithm];
        const expected = f[algorithm];
        it('returns ' + expected + ' for ' + f.hex, () => {
          const data = Buffer.from(f.hex, 'hex');
          const actual = fn(data).toString('hex');
          assert.strictEqual(actual, expected);
        });
      });
    });
  });
});
