import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  async findAll(@CurrentUser() user: any) {
    return this.jobsService.findAll(user.organizationId);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get job metrics' })
  async getMetrics(@CurrentUser() user: any) {
    return this.jobsService.getMetrics(user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  async findById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry failed job' })
  async retry(@Param('id') id: string) {
    return this.jobsService.retry(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel job' })
  async cancel(@Param('id') id: string) {
    return this.jobsService.cancel(id);
  }
}
