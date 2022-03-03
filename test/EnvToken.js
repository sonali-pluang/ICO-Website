const EnvToken = artifacts.require("EnvToken")

contract('EnvToken', function(accounts){

    it('allocates the initial supply upon deployment', function() {
        return EnvToken.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
          assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
          assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
        });
      });
    
    it('Sets the total supply upon deployment', function(){
        return EnvToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply(); 
        }).then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), 1000000, 'Sets the total supply to 1,000,000');
        });
    });

    it('Transfers token ownership', function(){
        return EnvToken.deployed().then(function(instance){
        tokenInstance = instance;
        
        // test "require" statement
        return tokenInstance.transfer.call(accounts[1], 888888888);
    }).then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'error messge must contain reert');
        return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    }).then((success) => {
        assert.equal(success, true, 'it returns true');
        return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then( (receipt) => {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
        assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account from which tokens are transferred');
        assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account to which tokens are transferred');
        assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
        return tokenInstance.balanceOf(accounts[1]);
    }).then ((balance) => {
        assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
        return tokenInstance.balanceOf(accounts[0]);
    }).then ((balance) => {
        assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
    });
});

})


