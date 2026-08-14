import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GuestLoginDto, GoogleLoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @ApiOperation({ summary: 'Login as Guest user' })
  async guestLogin(@Body() dto: GuestLoginDto) {
    return this.authService.guestLogin(dto);
  }

  @Post('google')
  @ApiOperation({ summary: 'Simulated Google OAuth Login' })
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getMe(@GetUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout authenticated user session' })
  async logout() {
    return { message: 'Logged out successfully' };
  }
}

