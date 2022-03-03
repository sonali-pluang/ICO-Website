const EnvToken = artifacts.require("EnvToken");
const EnvTokenSale = artifacts.require("EnvTokenSale")

module.exports = function (deployer) {
  deployer.deploy(EnvToken, 1000000). then (() => {
    let tokenPrice = 1000000000000000;
    return deployer.deploy(EnvTokenSale,EnvToken.address, tokenPrice )
  });
};
