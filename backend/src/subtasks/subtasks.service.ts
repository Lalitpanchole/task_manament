import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/create-subtask.dto';
import { toPrismaTaskPriority, fromPrismaTaskPriority } from '../common/utils/enum-mappers';

@Injectable()
export class SubtasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTask(taskId: string) {
    const subtasks = await this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });

    return subtasks.map((s) => ({
      id: s.id,
      title: s.title,
      completed: s.completed,
      priority: fromPrismaTaskPriority(s.priority),
      memberId: s.memberId || undefined,
      dueDate: s.dueDate || undefined,
    }));
  }

  async create(taskId: string, dto: CreateSubtaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const subtask = await this.prisma.subtask.create({
      data: {
        taskId,
        title: dto.title,
        priority: toPrismaTaskPriority(dto.priority),
        memberId: dto.memberId,
        dueDate: dto.dueDate || new Date().toISOString().split('T')[0],
      },
    });

    return {
      id: subtask.id,
      title: subtask.title,
      completed: subtask.completed,
      priority: fromPrismaTaskPriority(subtask.priority),
      memberId: subtask.memberId || undefined,
      dueDate: subtask.dueDate || undefined,
    };
  }

  async update(id: string, dto: UpdateSubtaskDto) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.completed !== undefined) updateData.completed = dto.completed;
    if (dto.priority !== undefined) updateData.priority = toPrismaTaskPriority(dto.priority);
    if (dto.memberId !== undefined) updateData.memberId = dto.memberId;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate;

    const updated = await this.prisma.subtask.update({
      where: { id },
      data: updateData,
    });

    return {
      id: updated.id,
      title: updated.title,
      completed: updated.completed,
      priority: fromPrismaTaskPriority(updated.priority),
      memberId: updated.memberId || undefined,
      dueDate: updated.dueDate || undefined,
    };
  }

  async remove(id: string) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }

    await this.prisma.subtask.delete({ where: { id } });
    return { message: 'Subtask deleted successfully' };
  }
}
