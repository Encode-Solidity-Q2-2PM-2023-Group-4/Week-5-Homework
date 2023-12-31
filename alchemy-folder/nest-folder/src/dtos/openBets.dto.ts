import { ApiProperty } from '@nestjs/swagger';

export class openBetsDTO {
  @ApiProperty({ type: String, required: true, default: 'Default Lottery Adress' })
  address: string;
  @ApiProperty({ type: Number, required: true, default: "Default Closing Time" })
  closingTime: number;
}