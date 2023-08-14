import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const MINT_VALUE = ethers.parseUnits("1");

async function main() {
   const proposals = process.argv.slice(2,5);
   const targetBlockNumber = process.argv[5];
   console.log(targetBlockNumber);
   console.log("Deploying Ballot contract");
   console.log("Proposals: ");
   proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
    });

  
      // Set up for test net 
   const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

   console.log(`Using address ${wallet.address}`);
   const balanceBN = await provider.getBalance(wallet.address);
   const balance = Number(ethers.formatUnits(balanceBN));
   console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
      throw new Error("Not enough ether");
    }
   // Contract Deployment and accounts
   const tokenContractFactory = new MyToken__factory(wallet);
   const tokenContract = await tokenContractFactory.deploy();
   await tokenContract.waitForDeployment();
   const tokenContractAddress = await tokenContract.getAddress();
   console.log(`Token contract deployed at ${tokenContractAddress}\n`);

   const contractFactory = new TokenizedBallot__factory(wallet);
   const contract = await contractFactory.deploy(proposals.map(ethers.encodeBytes32String),tokenContractAddress, targetBlockNumber);
   await contract.waitForDeployment();
   const contractAddress = await contract.getAddress();
   console.log(`Tokenized Ballot ontract deployed at ${contractAddress}\n`);

  
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})