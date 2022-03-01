const  EnvToken = artifacts.require("EnvToken");

module.exports = function (deployer) {
  deployer.deploy(EnvToken);
};
