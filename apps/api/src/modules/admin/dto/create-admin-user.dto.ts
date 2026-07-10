import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../auth/roles.decorator';
import { SubscriptionType } from '../../auth/user.schema';

export class CreateAdminUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.User })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    default: SubscriptionType.FREE,
    description:
      'Any existing subscription tier name (free-form — see GET /admin/subscription-types)',
  })
  @IsOptional()
  @IsString()
  subscription?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;
}
