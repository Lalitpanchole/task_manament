import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Activity')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('tasks/:taskId/activity')
  @ApiOperation({ summary: 'Get task activity timeline logs' })
  async findByTask(@Param('taskId') taskId: string) {
    return this.activityService.findByTask(taskId);
  }
}

