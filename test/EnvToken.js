const EnvToken = artifacts.require("EnvToken")

contract('EnvToken', function(accounts){
    
    it('Sets the total supply upon deployment', function(){
        return EnvToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply(); 
        }).then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), 1000000, 'Sets the total supply to 1,000,000');
        });
    });
})