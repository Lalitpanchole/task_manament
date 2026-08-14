import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Write API Documentation' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Create clear and detailed API documentation', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'To Do', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'High', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: '2026-07-20', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ example: '2026-07-31', required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({ example: 'proj-1', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ example: 'm-1', required: false })
  @IsOptional()
  @IsString()
  reporterId?: string;

  @ApiProperty({ example: ['m-1', 'm-3'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @ApiProperty({ example: ['Research', 'Design'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}
