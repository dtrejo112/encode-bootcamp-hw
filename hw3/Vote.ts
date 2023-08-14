import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory, MyToken, TokenizedBallot } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const MINT_VALUE = ethers.parseUnits("2");

async function main() {
    const parameter = process.argv.slice(2);
    const contractAddress = parameter[0];
    const tokeContractAddressParam = parameter[1];
    const proposal = parameter[2];
    const amount = parameter[3];

  // Set up for test net 
   const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  const tokenContractFactory = new MyToken__factory(wallet);
  const tokenContract = tokenContractFactory.attach(tokeContractAddressParam) as MyToken;
  // Mint some tokens
  const mintTx = await tokenContract.mint(wallet.address, MINT_VALUE);
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${wallet.address}\n`
  );
  const balanceOf = await tokenContract.balanceOf(wallet.address);
  console.log(
    `Account ${
      wallet.address
    } has ${balanceOf.toString()} decimal units of MyToken\n`
  );
   const ballotFactory = new TokenizedBallot__factory(wallet);
   const ballotContract = ballotFactory.attach(contractAddress) as TokenizedBallot;


  // Self delegate
  const delegateTx = await tokenContract.connect(wallet).delegate(wallet.address);
  await delegateTx.wait();
  
  const votes1AfterTransfer = await tokenContract.getVotes(wallet.address);
  console.log(
    `Account ${
      wallet.address
    } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
  );

  const voteTx = await ballotContract.connect(wallet).vote(proposal, ethers.parseUnits("0"));
  await voteTx.wait();


}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})