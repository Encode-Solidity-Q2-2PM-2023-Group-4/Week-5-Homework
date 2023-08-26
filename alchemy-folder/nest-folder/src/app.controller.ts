import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { openBetsDTO } from './dtos/openBets.dto';

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
}