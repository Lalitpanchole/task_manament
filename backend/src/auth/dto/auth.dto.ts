import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class GuestLoginDto {
  @ApiProperty({ example: 'Dexter', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'dexter@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class GoogleLoginDto {
  @ApiProperty({ example: 'dexter@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Dexter', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
