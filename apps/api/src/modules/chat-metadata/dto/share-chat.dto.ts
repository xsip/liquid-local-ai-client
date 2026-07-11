import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShareChatDto {
  @ApiProperty()
  @IsString()
  username: string;
}
