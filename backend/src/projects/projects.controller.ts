import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all workspace projects' })
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details by ID' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Body() dto: CreateProjectDto, @GetUser('id') userId: string) {
    return this.projectsService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update existing project' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'List tasks assigned to a specific project' })
  async findProjectTasks(@Param('id') id: string) {
    return this.projectsService.findProjectTasks(id);
  }
}

