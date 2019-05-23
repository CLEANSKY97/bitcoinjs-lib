'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const __1 = require('..');
const { describe, it, beforeEach } = require('mocha');
const assert = require('assert');
const fixtures = require('../ts_test/fixtures/block');
describe('Block', () => {
  describe('version', () => {
    it('should be interpreted as an int32le', () => {
      const blockHex =
        'ffffffff000000000000000000000000000000000000000000000000000000000000' +
        '00004141414141414141414141414141414141414141414141414141414141414141' +
        '01000000020000000300000000';
      const block = __1.Block.fromHex(blockHex);
      assert.strictEqual(-1, block.version);
      assert.strictEqual(1, block.timestamp);
    });
  });
  describe('calculateTarget', () => {
    fixtures.targets.forEach(f => {
      it('returns ' + f.expected + ' for 0x' + f.bits, () => {
        const bits = parseInt(f.bits, 16);
        assert.strictEqual(
          __1.Block.calculateTarget(bits).toString('hex'),
          f.expected,
        );
      });
    });
  });
  describe('fromBuffer/fromHex', () => {
    fixtures.valid.forEach(f => {
      it('imports ' + f.description, () => {
        const block = __1.Block.fromHex(f.hex);
        assert.strictEqual(block.version, f.version);
        assert.strictEqual(block.prevHash.toString('hex'), f.prevHash);
        assert.strictEqual(block.merkleRoot.toString('hex'), f.merkleRoot);
        if (block.witnessCommit) {
          assert.strictEqual(
            block.witnessCommit.toString('hex'),
            f.witnessCommit,
          );
        }
        assert.strictEqual(block.timestamp, f.timestamp);
        assert.strictEqual(block.bits, f.bits);
        assert.strictEqual(block.nonce, f.nonce);
        assert.strictEqual(!block.transactions, f.hex.length === 160);
      });
    });
    fixtures.invalid.forEach(f => {
      it('throws on ' + f.exception, () => {
        assert.throws(() => {
          __1.Block.fromHex(f.hex);
        }, new RegExp(f.exception));
      });
    });
  });
  describe('toBuffer/toHex', () => {
    fixtures.valid.forEach(f => {
      let block;
      beforeEach(() => {
        block = __1.Block.fromHex(f.hex);
      });
      it('exports ' + f.description, () => {
        assert.strictEqual(block.toHex(true), f.hex.slice(0, 160));
        // @ts-ignore
        assert.strictEqual(block.toHex(), f.hex);
      });
    });
  });
  describe('getHash/getId', () => {
    fixtures.valid.forEach(f => {
      let block;
      beforeEach(() => {
        block = __1.Block.fromHex(f.hex);
      });
      it('returns ' + f.id + ' for ' + f.description, () => {
        assert.strictEqual(block.getHash().toString('hex'), f.hash);
        assert.strictEqual(block.getId(), f.id);
      });
    });
  });
  describe('getUTCDate', () => {
    fixtures.valid.forEach(f => {
      let block;
      beforeEach(() => {
        block = __1.Block.fromHex(f.hex);
      });
      it('returns UTC date of ' + f.id, () => {
        const utcDate = block.getUTCDate().getTime();
        assert.strictEqual(utcDate, f.timestamp * 1e3);
      });
    });
  });
  describe('calculateMerkleRoot', () => {
    it('should throw on zero-length transaction array', () => {
      assert.throws(() => {
        __1.Block.calculateMerkleRoot([]);
      }, /Cannot compute merkle root for zero transactions/);
    });
    fixtures.valid.forEach(f => {
      if (f.hex.length === 160) return;
      let block;
      beforeEach(() => {
        block = __1.Block.fromHex(f.hex);
      });
      it('returns ' + f.merkleRoot + ' for ' + f.id, () => {
        assert.strictEqual(
          __1.Block.calculateMerkleRoot(block.transactions).toString('hex'),
          f.merkleRoot,
        );
      });
      if (f.witnessCommit) {
        it('returns witness commit ' + f.witnessCommit + ' for ' + f.id, () => {
          assert.strictEqual(
            __1.Block.calculateMerkleRoot(block.transactions, true).toString(
              'hex',
            ),
            f.witnessCommit,
          );
        });
      }
    });
  });
  describe('checkTxRoots', () => {
    fixtures.valid.forEach(f => {
      if (f.hex.length === 160) return;
      let block;
      beforeEach(() => {
        block = __1.Block.fromHex(f.hex);
      });
      it('returns ' + f.valid + ' for ' + f.id, () => {
        assert.strictEqual(block.checkTxRoots(), true);
      });
    });
  });
  describe('checkProofOfWork', () => {
    fixtures.valid.forEach(f => {
      let block;
      beforeEach(() => {
        block = __1.Block.fromHex(f.hex);
      });
      it('returns ' + f.valid + ' for ' + f.id, () => {
        assert.strictEqual(block.checkProofOfWork(), f.valid);
      });
    });
  });
});
