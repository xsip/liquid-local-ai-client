import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../auth/roles.decorator';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ description: 'New password — leave unset to keep the current one' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description:
      'Any existing subscription tier name (free-form — see GET /admin/subscription-types)',
  })
  @IsOptional()
  @IsString()
  subscription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;
}
