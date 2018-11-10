pragma solidity ^0.4.2;

contract Story {
    

 	
     
    struct storyLine
    {
        string line;
        uint voteCount;
    }

    storyLine[11] public arrayOfLines; // keep track of status of lines in each round
    string[100]public  finalStory;     // final lines in story
    uint public lineCount = 0;         // final story line count
    string public lineselected;

    mapping( address => uint) votedInThisRound;

 

    // Constructor
    constructor() public
    {
        
        arrayOfLines[0].line = "Line 0 "; arrayOfLines[0].voteCount = 0;
        arrayOfLines[1].line = "Line 1 "; arrayOfLines[1].voteCount = 0; 
        arrayOfLines[2].line = "Line 2 "; arrayOfLines[2].voteCount = 0;
        arrayOfLines[3].line = "Line 3 "; arrayOfLines[3].voteCount = 0;
        arrayOfLines[4].line = "Line 4 "; arrayOfLines[4].voteCount = 0;
    }

    modifier notVoted()
    {
        require( votedInThisRound[msg.sender]<1 , " Already proposed line ");_;
    }


    function casteVote(uint idx) public
    {
        //votedInThisRound[msg.sender] = 1;
        arrayOfLines[idx].voteCount += 1;        	
        
    }

    function addStoryLine() // add line to story and reset count to zero
    {

        uint roundPropose  = 0;
        for (uint i =0;i<5;i++)
        {
            if(arrayOfLines[i].voteCount > arrayOfLines[roundPropose].voteCount)
            {
                roundPropose = i;
            }
            arrayOfLines[i].voteCount = 0;
        }
        finalStory[lineCount] = arrayOfLines[roundPropose].line;
        lineCount ++;
        lineselected = arrayOfLines[roundPropose].line;
    }


}
