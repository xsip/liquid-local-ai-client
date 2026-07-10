import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../auth/roles.decorator';

export class AdminUserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ description: 'Free-form subscription tier name' })
  subscription: string;

  @ApiProperty()
  isActivated: boolean;

  @ApiProperty()
  usedTokens: number;

  @ApiPropertyOptional({ type: Date, nullable: true })
  tokenCountResetDate: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
