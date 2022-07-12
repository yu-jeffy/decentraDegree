const UserStorage = artifacts.require('./UserStorage.sol');

module.exports = function (deployer) {
  deployer.deploy(UserStorage);
};
