import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  toPrismaTaskPriority,
  fromPrismaTaskPriority,
  toPrismaProjectStatus,
  fromPrismaProjectStatus,
  fromPrismaTaskStatus,
} from '../common/utils/enum-mappers';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      priority: fromPrismaTaskPriority(p.priority),
      leadId: p.leadId,
      dueDate: p.dueDate || '',
      status: fromPrismaProjectStatus(p.status),
      taskCount: p._count.tasks,
    }));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      priority: fromPrismaTaskPriority(project.priority),
      leadId: project.leadId,
      dueDate: project.dueDate || '',
      status: fromPrismaProjectStatus(project.status),
      taskCount: project._count.tasks,
    };
  }

  async create(dto: CreateProjectDto, userId: string) {
    const leadId = dto.leadId || userId;
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description || '',
        priority: toPrismaTaskPriority(dto.priority),
        dueDate: dto.dueDate || new Date().toISOString().split('T')[0],
        status: toPrismaProjectStatus(dto.status),
        leadId,
      },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      priority: fromPrismaTaskPriority(project.priority),
      leadId: project.leadId,
      dueDate: project.dueDate || '',
      status: fromPrismaProjectStatus(project.status),
      taskCount: 0,
    };
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.priority !== undefined) updateData.priority = toPrismaTaskPriority(dto.priority);
    if (dto.leadId !== undefined) updateData.leadId = dto.leadId;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate;
    if (dto.status !== undefined) updateData.status = toPrismaProjectStatus(dto.status);

    const updated = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || '',
      priority: fromPrismaTaskPriority(updated.priority),
      leadId: updated.leadId,
      dueDate: updated.dueDate || '',
      status: fromPrismaProjectStatus(updated.status),
      taskCount: updated._count.tasks,
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }

  async findProjectTasks(projectId: string) {
    await this.findOne(projectId);
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        subtasks: true,
        comments: {
          include: { user: true },
        },
        resources: true,
        members: {
          include: { user: true },
        },
        labels: {
          include: { label: true },
        },
        updates: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      status: fromPrismaTaskStatus(t.status),
      priority: fromPrismaTaskPriority(t.priority),
      startDate: t.startDate || undefined,
      dueDate: t.dueDate || undefined,
      projectId: t.projectId || undefined,
      reporterId: t.reporterId || undefined,
      memberIds: t.members.map((m) => m.userId),
      labels: t.labels.map((l) => l.label.name),
      subtasks: t.subtasks.map((s) => ({
        id: s.id,
        title: s.title,
        completed: s.completed,
        priority: fromPrismaTaskPriority(s.priority),
        memberId: s.memberId || undefined,
        dueDate: s.dueDate || undefined,
      })),
      resources: t.resources.map((r) => ({
        id: r.id,
        title: r.title,
        url: r.url,
      })),
      comments: t.comments.map((c) => ({
        id: c.id,
        authorName: c.user.name,
        authorAvatar: c.user.avatar || '',
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      })),
      updates: t.updates.map((u) => ({
        id: u.id,
        authorName: u.user ? u.user.name : 'You',
        text: u.text,
        createdAt: u.createdAt.toISOString(),
      })),
    }));
  }
}
