import { ApiProperty } from '@nestjs/swagger';

export class buyTokensDTO {
  @ApiProperty({ type: String, required: true, default: 'My Adress' })
  address: string;
  @ApiProperty({ type: Number, required: true, default: 'Default Buy Amount' })
  amount: number;
}