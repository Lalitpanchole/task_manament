import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Design Homepage' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Redesign main landing page', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'High', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: 'm-1', required: false })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiProperty({ example: '2026-09-12', required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({ example: 'Active', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
