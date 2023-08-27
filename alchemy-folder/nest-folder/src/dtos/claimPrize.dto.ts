import { ApiProperty } from '@nestjs/swagger';

export class claimPrizeDTO {
  @ApiProperty({ type: Number, required: true, default: 'Default_Prize' })
  amount: number;
}
