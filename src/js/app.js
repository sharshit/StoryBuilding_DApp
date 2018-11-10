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
    );
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
      for (let i = 0; i <= 4; i++) {
        storyInstance.arrayOfLines(i).then(function(line) {
          var tline = line[0];
          var voteCount = line[1];
          console.log(line)
          // Render candidate Result
          var candidateTemplate = "<tr><th>" + tline + "</td><td>" + voteCount + "</td></tr> "
          story.append(candidateTemplate);
        //   // Render candidate ballot option
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

  castVote: function() 
  {
    var candidateId = $('#candidatesSelect').val();
    console.log(candidateId)
    App.contracts.Story.deployed().then(function(instance) {
      // return instance.casteVote(candidateId, { from: App.account });
      return instance.casteVote(candidateId);
    }).then(function(result) {
      // Wait for votes to update
      App.render()
    }).catch(function(err) {
      console.error(err);
    });
  },


  endRound: function() 
  {
    // var candidateId = $('#candidatesSelect').val();
    // console.log(candidateId)
    App.contracts.Story.deployed().then(async function(instance) {
      // return instance.casteVote(candidateId, { from: App.account });
      await instance.addStoryLine()
      return instance.lineselected();
    }).then(function(result) {
      // Wait for votes to update
      console.log("Line to be added",result)
      App.render()
    }).catch(function(err) {
      console.error(err);
    });
  },

  showStory: function()
  {
    // Needs to update this
    App.contracts.Story.deployed().then(function(instance) {
      storyInstance = instance;
      return storyInstance;
    }).then(function( storyInstance ) {
      var story = $("#finalStory");
      story.empty();
      storyInstance.lineCount().then(function(num_lines){
      console.log("Number of lines",num_lines)
      for (let i = 0; i < num_lines; i++) {
        storyInstance.finalStory(i).then(function(line){
          // var tline = line[0];
          // var voteCount = line[1];
          console.log("finalStory lines",line)

          // Render candidate Result
          var lineTemplate = "<li>" + line + "</li>";
          story.append("<ul>"+lineTemplate+"</ul>");

        //   // Render candidate ballot option
        // var candidateOption = "<option value='" + i + "' >" + tline + "</ option>"
        // candidatesSelect.append(candidateOption);
        });
      }
      })
  });
}
}
$(function() {
  $(window).load(function() {
    App.init();
  });
});