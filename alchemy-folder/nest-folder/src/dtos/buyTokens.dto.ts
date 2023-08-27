import { ApiProperty } from '@nestjs/swagger';

export class buyTokensDTO {
  @ApiProperty({ type: Number, required: true, default: '1' })
  value: number;
}
