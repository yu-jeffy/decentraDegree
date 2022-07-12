const NTT = artifacts.require('./NTT.sol');

module.exports = function (deployer) {
  deployer.deploy(NTT);
};
