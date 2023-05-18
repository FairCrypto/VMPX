const VMPX = artifacts.require("VMPX");

module.exports = async function (deployer, network) {
  const cycles = process.env[`${network.toUpperCase()}_CYCLES`] || 50;
  await deployer.deploy(VMPX, cycles);
};
