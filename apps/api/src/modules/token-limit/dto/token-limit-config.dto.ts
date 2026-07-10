import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, Matches } from 'class-validator';

export class CreateTokenLimitConfigDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  minutesTillReset: number;

  @ApiProperty({ example: 9000 })
  @IsInt()
  @IsPositive()
  tokensPerInterval: number;

  @ApiProperty({
    example: 'basic',
    description:
      'Free-form subscription tier name. Creating a config with a new ' +
      'name defines a new subscription type.',
  })
  @IsString()
  @Matches(/^[a-z0-9_-]{2,32}$/, {
    message:
      'subscription must be 2-32 characters, lowercase letters/digits/underscore/dash only',
  })
  subscription: string;
}

export class UpdateTokenLimitConfigDto extends PartialType(
  CreateTokenLimitConfigDto,
) {}
