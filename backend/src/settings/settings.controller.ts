import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user field visibility preferences' })
  async getSettings(@GetUser('id') userId: string) {
    return this.settingsService.getSettings(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user field visibility preferences' })
  async updateSettings(@GetUser('id') userId: string, @Body() preferences: any) {
    return this.settingsService.updateSettings(userId, preferences);
  }
}

