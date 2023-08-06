import { decodeBytes32String, ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import { Ballot } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const parameter = process.argv.slice(2);
    const contractAddress = parameter[0];
    const castVote = parameter[1];
    const voterAddress = parameter[2];

const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

console.log(`Using address ${wallet.address}`);
const balanceBN = await provider.getBalance(wallet.address);

const balance = Number(ethers.formatUnits(balanceBN));
console.log(`Wallet balance ${balance}`);
if (balance < 0.01) {
  throw new Error("Not enough ether");
}

// Attach to contract using your wallet and contract address
const ballotFactory = new Ballot__factory(wallet);
const ballotContract = ballotFactory.attach(contractAddress) as Ballot;

// Get proposal name using index from castVote
const proposal = await ballotContract.proposals(castVote);
const proposalName = ethers.decodeBytes32String(proposal.name);

console.log(`Casting vote for proposal ${castVote}: ${proposalName}`);

// Transaction for casting a vote
try {
  const castVoteTx = await ballotContract.vote(castVote);
  console.log(`Vote for proposal ${castVote}: ${proposalName}, successful!`);
} catch(error : any) {
  console.log(`Transaction reverted error -> ${error.revert.args[0]}`);
};
// Transaction for giving a right to vote
try {
  const giveRightToVoteTx = await ballotContract.giveRightToVote(voterAddress);
} catch (error : any) {
  console.log(`Transaction reverted error -> ${error.revert.args[0]}`);
};
// Transaction for delegating a vote
try {
  const delegateTx = await ballotContract.delegate(voterAddress);
  console.log(`Delegated to  -> ${voterAddress}`);
} catch (error : any) {
  console.log(`Transaction reverted error -> ${error.revert.args[0]}`);
};
// Reading for winning proposal and its number
try {
  const winnerNameFunc = await ballotContract.winnerName();
  const winnerName = decodeBytes32String(winnerNameFunc);
  const winningProposal = await ballotContract.winningProposal();
  console.log(`Winning proposal # is: ${winningProposal}, name: ${winnerName}`);
} catch (error : any) {
  console.log(`Transaction reverted error -> ${error.revert.args[0]}`);
}

}

main();