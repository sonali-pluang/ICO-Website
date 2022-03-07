App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,
  
    init: function() {
      console.log("App initialized...")
      return App.initWeb3();
    },
  
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContracts();
    },
  
    initContracts: function() {
      $.getJSON("EnvTokenSale.json", function(envTokenSale) {
        App.contracts.EnvTokenSale = TruffleContract(envTokenSale);
        App.contracts.EnvTokenSale.setProvider(App.web3Provider);
        App.contracts.EnvTokenSale.deployed().then(function(envTokenSale) {
          console.log("Env Token Sale Address:", envTokenSale.address);
        });
      }).done(function() {
        $.getJSON("EnvToken.json", function(envToken) {
          App.contracts.EnvToken = TruffleContract(envToken);
          App.contracts.EnvToken.setProvider(App.web3Provider);
          App.contracts.EnvToken.deployed().then(function(envToken) {
          console.log("Env Token Address:", envToken.address);
          });
  
        //  App.listenForEvents();
          return App.render();
        });
      })
    },
  
    listenForEvents: () => {
      App.contracts.EnvTokenSale.deployed().then((instance) => {
        console.log("Event listener")
      //   web3.eth.subscribe(instance.Sell, {
      //     fromBlock: 0,
      //     toBlock: 'latest',
      // }, function(error, result){
      //     if (!error)
      //         console.log(result);
      // })
        instance.Sell({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).then((event) => {
          console.log("event triggered", event);
          App.render();
        })
      })
    },
  
    render: async () =>{
      if (App.loading) {
        return;
      }
      App.loading = true;
  
      var loader  = $('#loader');
      var content = $('#content');
  
      loader.show();
      content.hide();
      
      await window.ethereum.enable();

      // Load account data
      web3.eth.getAccounts((err, accounts) => {
        if(err === null) {
          App.account = accounts[0];
          console.log(accounts)
          $('#accountAddress').html("Your Account: " + accounts[0]);
        }
      })
  
       // Load token sale contract
       App.contracts.EnvTokenSale.deployed().then((instance) => {
        envTokenSaleInstance = instance;
        console.log(envTokenSaleInstance.tokenPrice())
        return envTokenSaleInstance.tokenPrice();
      }).then((tokenPrice) => {
        console.log(tokenPrice)
        App.tokenPrice = tokenPrice;
        $('.token-price').html((App.tokenPrice.toNumber())/1000000000000000000);
        return envTokenSaleInstance.tokensSold();
      }).then((tokensSold) =>{
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
  
        let progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');
  
        // Load token contract
        App.contracts.EnvToken.deployed().then((instance) => {
          envTokenInstance = instance;
          return envTokenInstance.balanceOf(App.account);
        }).then((balance) => {
          $('.env-balance').html(balance.toNumber());
          App.loading = false;
          loader.hide();
          content.show();
        })
      });
    },
  
    buyTokens: function() {
      $('#content').hide();
      $('#loader').show();
      var numberOfTokens = $('#numberOfTokens').val();
      App.contracts.EnvTokenSale.deployed().then((instance) => {
        envTokenSaleInstance = instance;
        return envTokenSaleInstance.buyTokens(numberOfTokens, {
          from: App.account,
          value: numberOfTokens * App.tokenPrice,
          gas: 500000 
        });
      }).then((result) => {
        console.log("Tokens bought...")
        $('form').trigger('reset') 
        console.log('form reset')
        // Waiting for Sell event
        App.render();
      });
    }
  }
  
  $(function() {
    $(window).on('load', function() {
      App.init();
    })
  })