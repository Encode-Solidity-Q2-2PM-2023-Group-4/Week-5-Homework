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
    console.log("Opening lottery at " + address);
    const openTX = await this.lotteryContract.openBets(closingTime);
    const receipt = await openTX.wait();
    console.log(receipt);
    return { success: true, txHash: openTX.hash };
  }

  async buyTokens(address: string, amount: number): Promise<any> {

  }

  async tokenBalance(address: string): Promise <any> {

  }

  async withdrawTokens(address: string, amount: number): Promise<any> {
    
  }

  async checkState(): Promise<any> {
    const thisProvider = this.provider;
    const state = await this.lotteryContract.betsOpen();
    console.log(`The lottery is ${state ? "open" : "closed"}\n`);
    if (!state) return;
    const currentBlock = await ethers.provider.getBlock("latest");
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
}
