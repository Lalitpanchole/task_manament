import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great progress on this task!' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
