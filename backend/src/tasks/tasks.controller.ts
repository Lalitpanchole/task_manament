import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter tasks by query parameters (search, status, priority, projectId, dueDate, memberId, labelId)' })
  async findAll(@Query() query: QueryTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details by ID' })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  async create(@Body() dto: CreateTaskDto, @GetUser('id') userId: string) {
    return this.tasksService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task properties (status, priority, title, dates, etc.)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @GetUser('id') userId: string,
  ) {
    return this.tasksService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Toggle member assignment on a task' })
  async toggleMember(@Param('id') id: string, @Body('memberId') memberId: string) {
    return this.tasksService.toggleMember(id, memberId);
  }

  @Post(':id/labels')
  @ApiOperation({ summary: 'Toggle label assignment on a task' })
  async toggleLabel(@Param('id') id: string, @Body('label') label: string) {
    return this.tasksService.toggleLabel(id, label);
  }

  @Post(':id/resources')
  @ApiOperation({ summary: 'Add a document link / resource to a task' })
  async addResource(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('url') url: string,
  ) {
    return this.tasksService.addResource(id, title, url);
  }
}

