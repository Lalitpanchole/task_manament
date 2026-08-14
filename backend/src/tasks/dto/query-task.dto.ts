import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryTaskDto {
  @ApiProperty({ required: false, description: 'Search title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by task status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: 'Filter by priority' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ required: false, description: 'Filter by project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false, description: 'Filter by due date' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({ required: false, description: 'Filter by assigned member ID' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiProperty({ required: false, description: 'Filter by label name or ID' })
  @IsOptional()
  @IsString()
  labelId?: string;
}
