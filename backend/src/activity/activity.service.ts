import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTask(taskId: string) {
    const logs = await this.prisma.activityLog.findMany({
      where: { taskId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((l) => ({
      id: l.id,
      authorName: l.user ? l.user.name : 'You',
      text: l.text,
      createdAt: l.createdAt.toISOString(),
    }));
  }
}
