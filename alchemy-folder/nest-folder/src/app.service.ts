import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from '../../backend/artifacts/contracts/LotteryToken.sol/LotteryToken.json'
import * as lotteryJson from '../../backend/artifacts/contracts/Lottery.sol/Lottery.json'
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

  async buyTokens(address: string, amount: number): Promise<any> {
    console.log(`Purchasing ${amount} units of LTK for ${address}...`)
    const tx = await this.lotteryContract.purchaseTokens();
    const receipt = await tx.wait();
    console.log(receipt);
    return { success: true, txHash: tx.hash };
  }

  async tokenBalance(address: string): Promise <any> {
    const balanceBN = await this.tokenContract.balanceOf(address);
    const balance_ = Number(balanceBN);
    return { success: true, balance: balance_ };
  }

  async withdrawTokens(address: string, amount: number): Promise<any> {
    console.log(`Withdrawing ${amount} units of LTK from the prize pool for ${address}...`)
    const withdrawTX = await this.lotteryContract.prizeWithdraw(amount);
    const receipt = await withdrawTX.wait();
    console.log(receipt);
    return { success: true, txHash: withdrawTX.hash };
  }
}