import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from '../../backend/artifacts/contracts/LotteryToken.sol/LotteryToken.json';
import * as lotteryJson from '../../backend/artifacts/contracts/Lottery.sol/Lottery.json';
import 'dotenv/config';
require('dotenv').config();

@Injectable()
export class AppService {
  tokenContract: ethers.Contract;
  lotteryContract: ethers.Contract;
  provider: ethers.Provider;
  wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_ENDPOINT_URL ?? '',
    );
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY ?? '', 
      this.provider,
    );
    this.tokenContract = new ethers.Contract(
      process.env.TOKEN_ADDRESS,
      tokenJson.abi,
      this.wallet,
    );
    this.lotteryContract = new ethers.Contract(
      process.env.LOTTERY_ADDRESS,
      lotteryJson.abi,
      this.wallet,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  async openBets(address: string, closingTime: number): Promise<any> {
    console.log("Opening lottery at " + address + "...");
    const openTX = await this.lotteryContract.openBets(closingTime);
    const receipt = await openTX.wait();
    console.log(receipt);
    return { success: true, txHash: openTX.hash };
  }

  //input 1 means user gets 1 eth worth of tokens, so here 1*1000 tokens
  async buyTokens(value: number): Promise<any> {
    console.log(`Purchasing lottery tokens worth of ` + value + `ETH` )
    const tx = await this.lotteryContract.purchaseTokens(ethers.parseEther(String(value)));
    const receipt = await tx.wait();
    console.log(receipt);
    return { success: true, txHash: tx.hash };
  }

  async withdrawTokens(address: string, amount: number): Promise<any> {
    console.log(`Withdrawing ${amount} units of LTK from the prize pool for ${address}...`)
    const withdrawTX = await this.lotteryContract.prizeWithdraw(amount);
    const receipt = await withdrawTX.wait();
    console.log(receipt);
    return { success: true, txHash: withdrawTX.hash };
  }

  async checkState(): Promise<any> {
    const state = await this.lotteryContract.betsOpen();
    console.log(`The lottery is ${state ? "open" : "closed"}\n`);
    if (!state) return;
    const currentBlock = await this.provider.getBlock("latest");
    const timestamp = currentBlock?.timestamp ?? 0;
    const currentBlockDate = new Date(timestamp * 1000);
    const closingTime = await this.lotteryContract.betsClosingTime();
    const closingTimeDate = new Date(Number(closingTime) * 1000);
    return(
    console.log(
      `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n
      lottery should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    ))
  }

  async displayOwnerPool(): Promise<any>{
    const balanceBN = await this.lotteryContract.ownerPool();
    const balance = ethers.formatUnits(balanceBN);
    return (console.log(`The owner pool has (${balance}) Tokens \n`))
  }

  async closeLottery(): Promise<any> {
    console.log("Closing lottery at " + this.lotteryContract.address);
    const closeTX = await this.lotteryContract.closeLottery();
    const receipt = await closeTX.wait();
    const state = await this.lotteryContract.betsOpen();
    const winner = await this.lotteryContract.winner();
    const prize = await this.lotteryContract.prizePool();
    console.log(`The lottery is ${state ? "open" : "closed"}\n and the winner address is: ${winner} who won ${prize}`);
    
    console.log(receipt);
    return { success: true, txHash: closeTX.hash };
  }

  async burnTokens(amount: number): Promise<any> {
    console.log(`Burning ${amount} units of LTK in exchange for ETH back to user`)
    const withdrawTX = await this.lotteryContract.returnTokens(amount);
    const receipt = await withdrawTX.wait();
    console.log(receipt);
    return { success: true, txHash: withdrawTX.hash };
  }

  async bet(): Promise<any>{
    console.log(`Submitting a bet`);
    const approval = await this.tokenContract.approve(process.env.LOTTERY_ADDRESS, 5000)
    const betTx = await this.lotteryContract.bet();
    const receipt = await betTx.wait();
    console.log(receipt);
    return { success: true, txHash: betTx.hash };
  }

  async claimPrize(amount: number) {
    console.log(`Claiming ${amount} prize....`)
    const claimTx = await this.lotteryContract.prizeWithdraw(amount);
    const receipt = await claimTx.wait();
    console.log(receipt);
    return { success: true, claimTxHash: claimTx.hash };
  }


  
}
