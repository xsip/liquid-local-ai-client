import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EphemeralMcpIntegrationDto } from './ephemeral-mcp-integration.dto';
import { OpenAiEndpointPreference } from '../chat-metadata.schema';
import { InvokeAiModel } from '../../invoke/invoke.service';

export class UpdateChatMetadataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usedModel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reasoningMode?: string;

  @ApiPropertyOptional({ type: [EphemeralMcpIntegrationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EphemeralMcpIntegrationDto)
  tools?: EphemeralMcpIntegrationDto[];

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  lastMessageSentAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  useCrypto?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cryptoKey?: string;

  @ApiPropertyOptional({
    enum: OpenAiEndpointPreference,
  })
  @IsOptional()
  openAiEndpointPreference?: OpenAiEndpointPreference;

  @ApiPropertyOptional()
  @IsOptional()
  useInvoke?: boolean;

  @ApiPropertyOptional({
    enum: InvokeAiModel,
  })
  @IsOptional()
  invokeAiModelToUse?: InvokeAiModel;
}
