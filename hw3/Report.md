# Weekend Project 3

Team members: Danny

**Contract Address:**
0x91ab01eB05920a8553CDb79E860a8b7bEB66Ee38

Transaction ID: 0x3fabd5193c08cdc11990d3002121e350ef14ffaeab89028a6467c24bbce50c50
https://sepolia.etherscan.io/tx/0x3fabd5193c08cdc11990d3002121e350ef14ffaeab89028a6467c24bbce50c50

Contract Code: Tokenized Ballot
```solidity 
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Voting with Tokenized Ballot.

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}
contract TokenizedBallot {
    IMyToken tokenContract;

    struct Proposal {
        bytes32 name;   
        uint voteCount; 
    }

    mapping(address => uint256) public votingPowerSpent;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {

        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
   
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    } 

    function vote(uint256 proposal, uint256 amount) external {
       //TODO
       require(
        votingPower(msg.sender) >= amount,
        'TokenizedBallot: trying to vote more than allowed'
       );
       votingPowerSpent[msg.sender] += amount;
       proposals[proposal].voteCount += amount;
    }
    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNumber) - votingPowerSpent[account];
    }
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
```
Contract Code: ERC20Token
```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract MyToken is ERC20, AccessControl, ERC20Permit, ERC20Votes {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
```
# Danny Transactions

**Wallet Address:**
0x2A8675085B6f9cA4B47574FCbBF7845b2a6B58fE

**First Transaction:**
https://sepolia.etherscan.io/tx/0x265503584b6a78ff5a6b3c1abf145ecd4a62d3d12e690d20a95d06b78d952ff7

State Changes 
- Vote was casted for proposal 1
- Proposal one count was inremented

