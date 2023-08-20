import { Injectable } from '@nestjs/common';
import { decodeBytes32String, ethers } from 'ethers';
import * as tokenjson from '../assets/MyToken.json';
import * as ballotjson from '../assets/TokenizedBallot.json';

@Injectable()
export class AppService {
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_ENDPOINT_URL ?? '',
    );
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY ?? '',
      this.provider,
    );
    this.tokenContract = new ethers.Contract(
      process.env.TOKEN_ADDRESS ?? '',
      tokenjson.abi,
      this.wallet,
    );
    this.ballotContract = new ethers.Contract(
      process.env.BALLOT_CONTRACT_ADDRESS ?? '',
      ballotjson.abi,
      this.wallet,
    );
  }
  getTokenAddress(): any {
    return { address: process.env.TOKEN_ADDRESS ?? '' };
  }

  getTotalSupply(): Promise<bigint> {
    return this.tokenContract.totalSupply();
  }
  getTokenBalance(address): Promise<bigint> {
    return this.tokenContract.balanceOf(address);
  }
  async mintTokens(address: string): Promise<any> {
    const tx = await this.tokenContract.mint(address, ethers.parseUnits('1'));
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash };
  }
  async selfDelegate(address: string): Promise<any> {
    const delegateTx = await this.tokenContract.delegate(address);
    const receipt = await delegateTx.wait();
    return { success: true, txHash: receipt.hash };
  }
  async vote(proposal: string, amount: string): Promise<any> {
    console.log(proposal);
    const voteTx = await this.ballotContract.vote(
      parseInt(proposal, 10),
      ethers.parseUnits(amount),
    );
    const proposalV = await this.ballotContract.proposals(
      parseInt(proposal, 10),
    );
    const actualProp = proposalV.name;

    const receipt = await voteTx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      proposalVoted: proposal,
      votedFor: decodeBytes32String(actualProp),
    };
  }
  async getWinningProposal(): Promise<any> {
    const winningProposal = await this.ballotContract.winnerName();
    const winningProposalNumber = await this.ballotContract.winningProposal();
    return {
      success: true,
      winningProposalNumber: winningProposalNumber.toString(),
      winningProposal: decodeBytes32String(winningProposal),
    };
  }
}
