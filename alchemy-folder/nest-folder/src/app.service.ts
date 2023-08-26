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
}
