const VMPX = artifacts.require("VMPX");
const BabyVMPX = artifacts.require("BabyVMPX");

module.exports = async function (deployer, network) {
  const cycles = process.env[`${network.toUpperCase()}_CYCLES`] || 6;
  const startBlock = process.env[`${network.toUpperCase()}_START_BLOCK`] || 0;
  console.log('Deploying with cycles', cycles, 'and start block', startBlock);
  await deployer.deploy(VMPX, cycles, startBlock);
  if (network === 'test') {
    await deployer.deploy(BabyVMPX, 50);
  }
};
