import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { Prisma } from '@prisma/client';
import {
  toPrismaTaskStatus,
  fromPrismaTaskStatus,
  toPrismaTaskPriority,
  fromPrismaTaskPriority,
} from '../common/utils/enum-mappers';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private mapTaskResponse(t: any) {
    return {
      id: t.id,
      title: t.title,
      description: t.description || '',
      status: fromPrismaTaskStatus(t.status),
      priority: fromPrismaTaskPriority(t.priority),
      startDate: t.startDate || undefined,
      dueDate: t.dueDate || undefined,
      projectId: t.projectId || undefined,
      reporterId: t.reporterId || undefined,
      memberIds: t.members ? t.members.map((m: any) => m.userId) : [],
      labels: t.labels ? t.labels.map((l: any) => l.label.name) : [],
      subtasks: t.subtasks
        ? t.subtasks.map((s: any) => ({
            id: s.id,
            title: s.title,
            completed: s.completed,
            priority: fromPrismaTaskPriority(s.priority),
            memberId: s.memberId || undefined,
            dueDate: s.dueDate || undefined,
          }))
        : [],
      resources: t.resources
        ? t.resources.map((r: any) => ({
            id: r.id,
            title: r.title,
            url: r.url,
          }))
        : [],
      comments: t.comments
        ? t.comments.map((c: any) => ({
            id: c.id,
            authorName: c.user ? c.user.name : 'Unknown',
            authorAvatar: c.user ? c.user.avatar || '' : '',
            content: c.content,
            createdAt: c.createdAt.toISOString(),
          }))
        : [],
      updates: t.updates
        ? t.updates.map((u: any) => ({
            id: u.id,
            authorName: u.user ? u.user.name : 'You',
            text: u.text,
            createdAt: u.createdAt.toISOString(),
          }))
        : [],
    };
  }

  async findAll(query: QueryTaskDto) {
    const where: Prisma.TaskWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    if (query.status) {
      where.status = toPrismaTaskStatus(query.status);
    }

    if (query.priority) {
      where.priority = toPrismaTaskPriority(query.priority);
    }

    if (query.projectId) {
      where.projectId = query.projectId;
    }

    if (query.dueDate) {
      where.dueDate = query.dueDate;
    }

    if (query.memberId) {
      where.members = {
        some: { userId: query.memberId },
      };
    }

    if (query.labelId) {
      where.labels = {
        some: {
          OR: [
            { labelId: query.labelId },
            { label: { name: query.labelId } },
          ],
        },
      };
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        subtasks: true,
        comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        resources: true,
        members: { include: { user: true } },
        labels: { include: { label: true } },
        updates: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((t) => this.mapTaskResponse(t));
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
        comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        resources: true,
        members: { include: { user: true } },
        labels: { include: { label: true } },
        updates: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.mapTaskResponse(task);
  }

  async create(dto: CreateTaskDto, userId: string) {
    const taskStatus = toPrismaTaskStatus(dto.status);
    const taskPriority = toPrismaTaskPriority(dto.priority);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title || 'Untitled Task',
        description: dto.description || '',
        status: taskStatus,
        priority: taskPriority,
        startDate: dto.startDate,
        dueDate: dto.dueDate || new Date().toISOString().split('T')[0],
        projectId: dto.projectId || 'proj-1',
        reporterId: dto.reporterId || userId,
        updates: {
          create: [
            {
              userId,
              text: 'created the task',
            },
          ],
        },
      },
      include: {
        subtasks: true,
        comments: { include: { user: true } },
        resources: true,
        members: { include: { user: true } },
        labels: { include: { label: true } },
        updates: { include: { user: true } },
      },
    });

    const memberIds = dto.memberIds || ['m-1'];
    for (const mId of memberIds) {
      const userExists = await this.prisma.user.findUnique({ where: { id: mId } });
      if (userExists) {
        await this.prisma.taskMember.create({
          data: { taskId: task.id, userId: mId },
        }).catch(() => {});
      }
    }

    const labels = dto.labels || ['Deployment'];
    for (const lName of labels) {
      let label = await this.prisma.label.findUnique({ where: { name: lName } });
      if (!label) {
        label = await this.prisma.label.create({ data: { name: lName } });
      }
      await this.prisma.taskLabel.create({
        data: { taskId: task.id, labelId: label.id },
      }).catch(() => {});
    }

    return this.findOne(task.id);
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const current = await this.findOne(id);
    const updateData: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = toPrismaTaskStatus(dto.status);
    if (dto.priority !== undefined) updateData.priority = toPrismaTaskPriority(dto.priority);
    if (dto.startDate !== undefined) updateData.startDate = dto.startDate;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate;
    if (dto.projectId !== undefined) {
      updateData.project = dto.projectId ? { connect: { id: dto.projectId } } : { disconnect: true };
    }

    await this.prisma.task.update({
      where: { id },
      data: updateData,
    });

    if (dto.status && dto.status !== current.status) {
      await this.prisma.activityLog.create({
        data: {
          taskId: id,
          userId,
          text: `changed status from ${current.status} to ${dto.status}`,
        },
      });
    }

    if (dto.priority && dto.priority !== current.priority) {
      await this.prisma.activityLog.create({
        data: {
          taskId: id,
          userId,
          text: `changed priority from ${current.priority} to ${dto.priority}`,
        },
      });
    }

    if (dto.dueDate && dto.dueDate !== current.dueDate) {
      await this.prisma.activityLog.create({
        data: {
          taskId: id,
          userId,
          text: `updated due date to ${dto.dueDate}`,
        },
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }

  async toggleMember(taskId: string, memberId: string) {
    await this.findOne(taskId);
    const existing = await this.prisma.taskMember.findUnique({
      where: { taskId_userId: { taskId, userId: memberId } },
    });

    if (existing) {
      await this.prisma.taskMember.delete({
        where: { taskId_userId: { taskId, userId: memberId } },
      });
    } else {
      await this.prisma.taskMember.create({
        data: { taskId, userId: memberId },
      });
    }

    return this.findOne(taskId);
  }

  async toggleLabel(taskId: string, labelName: string) {
    await this.findOne(taskId);
    let label = await this.prisma.label.findUnique({ where: { name: labelName } });
    if (!label) {
      label = await this.prisma.label.create({ data: { name: labelName } });
    }

    const existing = await this.prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId: label.id } },
    });

    if (existing) {
      await this.prisma.taskLabel.delete({
        where: { taskId_labelId: { taskId, labelId: label.id } },
      });
    } else {
      await this.prisma.taskLabel.create({
        data: { taskId, labelId: label.id },
      });
    }

    return this.findOne(taskId);
  }

  async addResource(taskId: string, title: string, url: string) {
    await this.findOne(taskId);
    await this.prisma.resource.create({
      data: {
        taskId,
        title: title || url,
        url: url.startsWith('http') ? url : `https://${url}`,
      },
    });
    return this.findOne(taskId);
  }
}
