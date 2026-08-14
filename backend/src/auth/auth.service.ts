import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GuestLoginDto, GoogleLoginDto } from './dto/auth.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  async guestLogin(dto: GuestLoginDto) {
    const email = dto.email || 'dexter@gmail.com';
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const baseUser = dto.email ? dto.email.split('@')[0] : 'guest';
      const username = `${baseUser}-${Date.now().toString().slice(-4)}`;
      user = await this.prisma.user.create({
        data: {
          id: 'guest-' + Date.now(),
          name: dto.name || 'Dexter',
          email,
          username,
          title: 'Designer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: 'Designer',
          userType: UserType.guest,
        },
      });
    }

    const token = this.generateToken(user.id, user.email);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        title: user.title || '',
        username: user.username || '',
        userType: user.userType,
        isAuthenticated: true,
      },
      token,
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    const email = dto.email || 'dexter@gmail.com';
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const baseUser = dto.email ? dto.email.split('@')[0] : 'google';
      const username = `${baseUser}-${Date.now().toString().slice(-4)}`;
      user = await this.prisma.user.create({
        data: {
          id: 'google-' + Date.now(),
          name: dto.name || 'Dexter',
          email,
          username,
          title: 'Designer',
          avatar: dto.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: 'Designer',
          userType: UserType.google,
        },
      });
    }

    const token = this.generateToken(user.id, user.email);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        title: user.title || '',
        username: user.username || '',
        userType: user.userType,
        isAuthenticated: true,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      title: user.title || '',
      username: user.username || '',
      userType: user.userType,
      isAuthenticated: true,
    };
  }
}
