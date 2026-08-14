import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/create-subtask.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Subtasks')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get('tasks/:taskId/subtasks')
  @ApiOperation({ summary: 'List all subtasks for a task' })
  async findByTask(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTask(taskId);
  }

  @Post('tasks/:taskId/subtasks')
  @ApiOperation({ summary: 'Add a new subtask to a task' })
  async create(@Param('taskId') taskId: string, @Body() dto: CreateSubtaskDto) {
    return this.subtasksService.create(taskId, dto);
  }

  @Patch('subtasks/:id')
  @ApiOperation({ summary: 'Update subtask details or completion state' })
  async update(@Param('id') id: string, @Body() dto: UpdateSubtaskDto) {
    return this.subtasksService.update(id, dto);
  }

  @Delete('subtasks/:id')
  @ApiOperation({ summary: 'Delete a subtask' })
  async remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}

