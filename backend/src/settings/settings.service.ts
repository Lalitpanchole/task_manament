import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_FIELDS = {
  priority: true,
  members: true,
  dueDate: true,
  labels: true,
  status: true,
  reporter: true,
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: {
          userId,
          fieldPreferences: DEFAULT_FIELDS,
        },
      });
    }

    return settings.fieldPreferences;
  }

  async updateSettings(userId: string, preferences: any) {
    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      update: { fieldPreferences: preferences },
      create: { userId, fieldPreferences: preferences },
    });

    return settings.fieldPreferences;
  }
}
