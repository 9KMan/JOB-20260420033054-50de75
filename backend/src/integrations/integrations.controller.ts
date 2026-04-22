import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all integrations' })
  async findAll(@CurrentUser() user: any) {
    return this.integrationsService.findAll(user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration by ID' })
  async findById(@Param('id') id: string) {
    return this.integrationsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new integration' })
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.integrationsService.create(user.organizationId, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update integration' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.integrationsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete integration' })
  async delete(@Param('id') id: string) {
    return this.integrationsService.delete(id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sync integration data' })
  async sync(@Param('id') id: string) {
    return this.integrationsService.sync(id);
  }
}
