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

    it('approves tokens for delegated transfer', function(){
        return EnvToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then((success) => {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
        }).then (receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account who authorized the tokens');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account to which the tokens are authorized');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(allowance => {
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for the delegated transfer')
        })
    })

    it('handle delegated transfers', () => {
        return EnvToken.deployed().then( instance => {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];

            //Transfers tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then( receipt => {
            //Give approval to spending account
            return tokenInstance.approve(spendingAccount, 10, {from : fromAccount});
        }).then( receipt => {
            //Try transferring amount larger than sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from : spendingAccount});
        }).then(assert.fail).catch( error => {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            //Try transfer amount larger than allowance
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from : spendingAccount});
        }).then(assert.fail).catch( error => {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than allowance');
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from : spendingAccount});
        }).then( receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then( balance => {
            assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then ( balance => {
            assert.equal(balance.toNumber(), 10, 'adds the amount to the receiver account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then ( allowance => {
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
    });

})


