import { decodeBytes32String, ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory, MyToken, TokenizedBallot } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const MINT_VALUE = ethers.parseUnits("2");

async function main() {
    const parameter = process.argv.slice(2);
    const contractAddress = parameter[0];
  

  // Set up for test net 
   const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

   const ballotFactory = new TokenizedBallot__factory(wallet);
   const ballotContract = ballotFactory.attach(contractAddress) as TokenizedBallot;

  
    const winningProposalName = await ballotContract.connect(wallet).winnerName();
    console.log(decodeBytes32String(winningProposalName));

    const winningProposal = await ballotContract.connect(wallet).winningProposal();
    console.log(winningProposal);


}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})