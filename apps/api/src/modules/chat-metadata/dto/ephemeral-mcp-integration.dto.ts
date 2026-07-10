import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * MCP integration descriptor persisted on ChatMetadata.tools — historically
 * shaped after the (now removed) Responses-API `type: 'mcp'` tool entry.
 */
export class EphemeralMcpIntegrationDto {
  @ApiProperty({ enum: ['ephemeral_mcp'] })
  @IsIn(['ephemeral_mcp'])
  type: 'ephemeral_mcp';

  @ApiProperty()
  @IsString()
  server_label: string;

  @ApiProperty()
  @IsString()
  server_url: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowed_tools?: string[];

  @ApiPropertyOptional({
    description: 'Custom HTTP headers sent to the MCP server',
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
