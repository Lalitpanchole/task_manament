import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar || '',
      title: u.title || '',
      role: u.role || u.title || 'Member',
      username: u.username || '',
      userType: u.userType,
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      title: user.title || '',
      role: user.role || user.title || 'Member',
      username: user.username || '',
      userType: user.userType,
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar || '',
      title: updated.title || '',
      role: updated.role || updated.title || 'Member',
      username: updated.username || '',
      userType: updated.userType,
      isAuthenticated: true,
    };
  }
}
