import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://root:password@127.0.0.1:3306/defaultdb?sslmode=require';
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dummyUrl = 'mysql://dummy:dummy@localhost:3306/dummy';
    let dbUrl = process.env.DATABASE_URL || dummyUrl;

    if (dbUrl && process.env.DB_SSL === 'true' && !dbUrl.includes('sslmode=')) {
      const separator = dbUrl.includes('?') ? '&' : '?';
      dbUrl = `${dbUrl}${separator}sslmode=require`;
    }

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database.');
    } catch (error) {
      this.logger.error(
        `Database connection warning: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.logger.warn(
        `NestJS application initialized in resilient mode. Database connection will be re-attempted on incoming requests.`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Disconnected from database.');
    } catch (error) {
      this.logger.error(
        `Error disconnecting from database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

