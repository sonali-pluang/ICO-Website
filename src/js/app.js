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
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
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
  
         // App.listenForEvents();
          return App.render();
        });
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

          App.loading = false;
          loader.hide();
          content.show();
  
    },
  
    
  }
  
  $(function() {
    $(window).on('load', function() {
      App.init();
    })
  })