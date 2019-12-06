pragma solidity ^0.5.8;

contract Auction {

    // Data structure to hold details of the item
    struct Item {
        uint itemId;
        uint[] itemTokens;
    }

   //Structure to hold the details of a persons
    struct Person {
        uint remainingTokens;
        uint personId;
        address addr;
    }

    mapping(address => Person) tokenDetails; //Mapping addresses to their respective Person structures
    Person [4] bidders; //Array containing 4 Person objects

    Item [3] public items;//Array containing 3 item objects
    address[3] public winners;//Array for address of winners
    address public beneficiary;//Address of the owner of the smart contract

    uint bidderCount=0; //Bidding Counter


    //Constructor
    constructor() public payable{
        //Make the owner the beneficiary of the contract
        beneficiary = msg.sender;

        //Initialize the items array
        uint[] memory emptyArray;
        items[0] = Item({itemId:0,itemTokens:emptyArray});

        //Add 2 items to the array
        items[1] = Item({itemId:1,itemTokens:emptyArray});
        items[2] =Item({itemId:2,itemTokens:emptyArray});
    }


    //Function to register a new bidder to the contract
    function register() public payable{
        //Add the info of the bidder to the attributes of the contract
        bidders[bidderCount].personId = bidderCount;
        bidders[bidderCount].addr = msg.sender;
        bidders[bidderCount].remainingTokens = 5;
        tokenDetails[msg.sender] = bidders[bidderCount];
        ++bidderCount;
    }

    //Function to place a bid for an item
    function bid(uint _itemId, uint _count) public payable{
        //Satisy pre-checks before placing the bid
        require((tokenDetails[msg.sender].remainingTokens >= _count) && (tokenDetails[msg.sender].remainingTokens != 0) && (_itemId <= 2));

        //Place the bid
        uint balance = tokenDetails[msg.sender].remainingTokens - _count;
        tokenDetails[msg.sender].remainingTokens = balance;
        bidders[tokenDetails[msg.sender].personId].remainingTokens = balance;//Update the balance in the bidders mapping.

        Item storage bidItem = items[_itemId];
        for(uint i = 0; i < _count; ++i)
            bidItem.itemTokens.push(tokenDetails[msg.sender].personId);
    }

    //Modifier to ensure that only the owner of the contract can reveal the winners
    modifier onlyOwner {
	       require(msg.sender == beneficiary);
           _;
    }

    //Function to reveal the winners of the bid
    function revealWinners() public onlyOwner{
        //Iterate through all people and find the winning bid
        for (uint id = 0; id < 3; ++id)
        {
            Item storage currentItem = items[id];
            if(currentItem.itemTokens.length != 0)
            {
                //For now, generate the winner at random
                uint randomIndex = (block.number / currentItem.itemTokens.length)% currentItem.itemTokens.length;

                // Obtain the winning tokenId
                uint winnerId = currentItem.itemTokens[randomIndex];

                //Assign the winner for each item
                winners[id] = bidders[winnerId].addr;
            }
        }
    }
}
