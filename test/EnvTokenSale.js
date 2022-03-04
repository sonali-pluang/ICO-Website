
const EnvToken = artifacts.require('./EnvToken.sol')
const EnvTokenSale = artifacts.require('./EnvTokenSale.sol')

contract('EnvTokenSale', (accounts) => {
    let tokenSaleInstance;
    let tokenInstance;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokenPrice = 1000000000000000; 
    let tokensAvailable = 750000;
    let numberOfTokens;
    
    it('initialize the contract correctly', () => {
        return EnvTokenSale.deployed().then( instance => {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then( address => {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }) .then(address => {
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(price => {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    })

    it('facilitates token buying', function() {
        return EnvToken.deployed().then((instance) => {
          tokenInstance = instance;
          return EnvTokenSale.deployed();
        }).then((instance) => {
          tokenSaleInstance = instance;
          // Provision 75% of all tokens to the token sale contract
          return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
        }).then((receipt) => {
          numberOfTokens = 10;
          return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then((receipt) => {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
          assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
          assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
          return tokenSaleInstance.tokensSold();
        }).then((amount) => {
          assert.equal(amount.toNumber(), numberOfTokens, 'check the number of tokens sold');
          return tokenInstance.balanceOf(buyer);
        }).then((balance) => {
          assert.equal(balance.toNumber(), numberOfTokens);
          return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then((balance) => {
          assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
          // Try to buy tokens different from the ether value
          return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
        }).then(assert.fail).catch((error) => {
          assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
          return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then(assert.fail).catch((error) =>  {
          assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
        });
      });

      it('ends token sale', () => {
        return EnvToken.deployed().then((instance) => {
          tokenInstance = instance;
          return EnvTokenSale.deployed();
        }).then((instance) => {
          tokenSaleInstance = instance;
          // Try to end sale from account other than the admin
          return tokenSaleInstance.endSale({ from: buyer });
        }).then(assert.fail).catch((error) =>  {
          assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
          // End the sale as admin
          return tokenSaleInstance.endSale({ from: admin });
        }).then((receipt) => {
          return tokenInstance.balanceOf(admin);
        }).then((balance) => {
          assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin');
          // Check that the contract has no balance and values are reset
          balance = web3.eth.getBalance(tokenSaleInstance.address)
          assert.equal(balance.toNumber(), 0);
        });
      });
})