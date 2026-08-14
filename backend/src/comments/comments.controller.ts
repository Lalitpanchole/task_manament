import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Comments')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'List all comments for a task' })
  async findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Post a new comment on a task' })
  async create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @GetUser('id') userId: string,
  ) {
    return this.commentsService.create(taskId, dto, userId);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  async remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}

