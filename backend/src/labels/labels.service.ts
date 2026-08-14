import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.label.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(name: string) {
    let label = await this.prisma.label.findUnique({ where: { name } });
    if (!label) {
      label = await this.prisma.label.create({ data: { name } });
    }
    return label;
  }

  async update(id: string, name: string) {
    const existing = await this.prisma.label.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
    return this.prisma.label.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.label.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
    await this.prisma.label.delete({ where: { id } });
    return { message: 'Label deleted successfully' };
  }
}
