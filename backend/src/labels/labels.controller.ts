import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LabelsService } from './labels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Labels')
@Controller('labels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  @ApiOperation({ summary: 'List all task labels' })
  async findAll() {
    return this.labelsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new label' })
  async create(@Body('name') name: string) {
    return this.labelsService.create(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a label' })
  async update(@Param('id') id: string, @Body('name') name: string) {
    return this.labelsService.update(id, name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a label' })
  async remove(@Param('id') id: string) {
    return this.labelsService.remove(id);
  }
}

