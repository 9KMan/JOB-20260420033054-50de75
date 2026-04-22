import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChurchesService } from './churches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('churches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('churches')
export class ChurchesController {
  constructor(private churchesService: ChurchesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current church' })
  async getCurrentChurch(@CurrentUser() user: any) {
    return this.churchesService.findById(user.organizationId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get church statistics' })
  async getStats(@CurrentUser() user: any) {
    return this.churchesService.getStats(user.organizationId);
  }

  @Get(':subdomain')
  @ApiOperation({ summary: 'Get church by subdomain' })
  async getBySubdomain(@Param('subdomain') subdomain: string) {
    return this.churchesService.findBySubdomain(subdomain);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current church' })
  async updateCurrentChurch(
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.churchesService.update(user.organizationId, data);
  }
}
