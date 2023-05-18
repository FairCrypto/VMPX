const VMPX = artifacts.require("VMPX");
const BabyVMPX = artifacts.require("BabyVMPX");

module.exports = async function (deployer, network) {
  const cycles = process.env[`${network.toUpperCase()}_CYCLES`] || 50;
  await deployer.deploy(VMPX, cycles);
  if (network === 'test') {
    await deployer.deploy(BabyVMPX, cycles);
  }
};
