import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTask(taskId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { taskId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((c) => ({
      id: c.id,
      authorName: c.user.name,
      authorAvatar: c.user.avatar || '',
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async create(taskId: string, dto: CreateCommentDto, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        taskId,
        userId,
        content: dto.content,
      },
      include: { user: true },
    });

    return {
      id: comment.id,
      authorName: comment.user.name,
      authorAvatar: comment.user.avatar || '',
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Comment deleted successfully' };
  }
}
