App = {
  
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
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
    console.log("Done")
    return App.initContract();
  },

  initContract: function() {
     $.getJSON("Story.json", function(election) 
    {
      // Instantiate a new truffle contract from the artifact
      console.log(App)
      // var election = {interface: null}
      App.contracts.Story = TruffleContract(election);
      console.log(App)
      // Connect provider to interact with contract
      App.contracts.Story.setProvider(App.web3Provider);

      return App.render();
    }
    )
;
  },

  render: function() {
    var storyInstance;
    // var loader = $("#loader");
    // var content = $("#content");

    // loader.show();
    // content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Story.deployed().then(function(instance) {
      storyInstance = instance;
      return storyInstance;
    }).then(function( storyInstance ) {
      var story = $("#Story");
      story.empty();

      var candidatesSelect = $('#candidatesSelect');
    candidatesSelect.empty();

      for (var i = 0; i <= 4; i++) {
        storyInstance.arrayOfLines(i).then(function(line) {
          var tline = line[0];
          var voteCount = line[1];
          console.log(voteCount)

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + tline + "</td><td>" + voteCount + "</td></tr> "
          story.append(candidateTemplate);

          // Render candidate ballot option
        var candidateOption = "<option value='" + i + "' >" + tline + "</ option>"
        candidatesSelect.append(candidateOption);


        });
      }

      // loader.hide();
      // content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },


  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Story.deployed().then(function(instance) {
      return instance.casteVote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      App.render()
    }).catch(function(err) {
      console.error(err);
    });
  }








};

$(function() {
  $(window).load(function() {
    App.init();
  });
});