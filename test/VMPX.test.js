// SPDX-License-Identifier: MIT

const assert = require('assert')
require('dotenv').config()
// const truffleAssert = require('truffle-assertions')

const VMPX = artifacts.require("VMPX")
const BabyVMPX = artifacts.require("BabyVMPX")

const print = process.env.EXTRA_PRINT
// const { bn2hexStr, toBigInt, maxBigInt, etherToWei } = require('../src/utils.js')

contract("VMPX", async accounts => {

    const cycles = Number(process.env[`TEST_CYCLES`]) || 40;
    let token, baby, gas, batch;
    const power = 195;

    before(async () => {
        try {
            token = await VMPX.deployed()
            baby = await BabyVMPX.deployed()
        } catch (e) {
            console.error(e)
        }
    })

    it("Should read basic ERC-20 params", async () => {
        assert.ok(await token.name() === 'VMPX');
        assert.ok(await token.symbol() === 'VMPX');
        assert.ok(await token.totalSupply().then(_ => _.toNumber()) === 0);
        assert.ok(await token.cycles().then(_ => _.toNumber()) === cycles);
        batch = await token.BATCH().then(_ => _.toString()).then(BigInt);
        batch = Number(batch / BigInt(1000000000000000000));
        console.log('cycles', await token.cycles().then(_ => _.toNumber()), 'batch', batch)
    })

    it("Should return gas estimates for mint", async () => {
        for await (const p of [1, 10, 20, 50, 100, 150, 195]) {
            gas = await token.mint.estimateGas(p);
            console.log(gas, gas / (p * batch), 700 * batch * p + 90_000);
        }
    })

    it("Should allow to mint with gas difficulty", async () => {
        await assert.doesNotReject(() => {
            return token.mint(power).then(res => {
                console.log(res?.receipt?.gasUsed.toLocaleString());
                return res
            })
        });
    })

    it("Should show increased counter post-mint by `cycles` amount", async () => {
        assert.ok(await token.counter().then(_ => _.toNumber()) === cycles * power);
    })

    it("Should allow to mint below cap", async () => {
        for (const i of Array(Math.floor(108_624 / 1_000)).fill(null)) {
            await assert.doesNotReject(() => baby.mint());
            process.stdout.write('.');
        }
        process.stdout.write('\n');
        // console.log(await baby.totalSupply().then(_ => _.toString()));
    })

    it("Should NOT allow to mint above cap", async () => {
        await assert.rejects(() => baby.mint(), 'ERC20Capped: cap exceeded');
    })
})
