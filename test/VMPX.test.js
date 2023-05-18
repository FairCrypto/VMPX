// SPDX-License-Identifier: MIT

const assert = require('assert')
require('dotenv').config()
// const truffleAssert = require('truffle-assertions')

const VMPX = artifacts.require("VMPX")

const print = process.env.EXTRA_PRINT
// const { bn2hexStr, toBigInt, maxBigInt, etherToWei } = require('../src/utils.js')

contract("VMPX", async accounts => {

    const cycles = Number(process.env[`TEST_CYCLES`]) || 40;
    let token, gas;

    before(async () => {
        try {
            token = await VMPX.deployed()
        } catch (e) {
            console.error(e)
        }
    })

    it("Should read basic ERC-20 params", async () => {
        assert.ok(await token.name() === 'VMPX');
        assert.ok(await token.symbol() === 'VMPX');
        assert.ok(await token.totalSupply().then(_ => _.toNumber()) === 0);
        assert.ok(await token.cycles().then(_ => _.toNumber()) === cycles);
    })

    it("Should return gas estimates for mint", async () => {
        gas = await token.mint.estimateGas();
        assert.ok(gas);
    })

    it("Should allow to mint", async () => {
        await assert.doesNotReject(() => {
            return token.mint().then(res => {
                console.log(res?.receipt?.gasUsed, gas);
                return res
            })
        });
    })
})
