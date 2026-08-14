import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubtaskDto {
  @ApiProperty({ example: 'Subtask 1' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Medium', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: 'm-2', required: false })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiProperty({ example: '2026-09-12', required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;
}

export class UpdateSubtaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;
}
