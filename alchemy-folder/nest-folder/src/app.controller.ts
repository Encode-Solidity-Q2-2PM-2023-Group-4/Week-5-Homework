import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { openBetsDTO } from './dtos/openBets.dto';
import { buyTokensDTO } from './dtos/buyTokens.dto';
import { wihdrawTokensDTO } from './dtos/withdrawTokens.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('open-bets')
  async openBets(@Body() body: openBetsDTO) {
    console.log({ body });
    return await this.appService.openBets(body.address, body.closingTime)
  }

  @Post('buy-tokens')
  async buyTokens(@Body() body: buyTokensDTO) {
    console.log({ body });
    return await this.appService.buyTokens(body.address, body.amount);
  }

  @Get('display-tkn-balance')
  async tokenBalance(@Param('address') address: string) {
    return await this.appService.tokenBalance(address);
  }

  @Post('withdraw-tokens')
  async withdrawTokens(@Body() body: wihdrawTokensDTO) {
    console.log({ body });
    return await this.appService.withdrawTokens(body.address, body.amount);
  }
  
  @Get('check-state')
  async checkState(){
    return await this.appService.checkState();
  }

  @Get('display-owner-pool')
  async displayOwnerPool(){
    return await this.appService.displayOwnerPool();
  }
}
