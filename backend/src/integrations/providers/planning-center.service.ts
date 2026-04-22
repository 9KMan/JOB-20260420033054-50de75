import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Integration } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

interface PlanningCenterPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface PlanningCenterServiceType {
  id: string;
  name: string;
  occurrences: Array<{
    id: string;
    scheduledDate: string;
    attendedCount?: number;
  }>;
}

@Injectable()
export class PlanningCenterService {
  private apiKey: string;
  private appId: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get('PLANNING_CENTER_API_KEY', '');
    this.appId = this.configService.get('PLANNING_CENTER_APP_ID', '');
  }

  async sync(integration: Integration) {
    // In production, sync with Planning Center API
    const mockData = {
      people: [] as PlanningCenterPerson[],
      serviceTypes: [] as PlanningCenterServiceType[],
      lastSync: new Date(),
    };

    await this.prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    return mockData;
  }

  async getPeople() {
    // Mock implementation
    return [];
  }

  async getServiceTypes() {
    // Mock implementation
    return [];
  }

  async getOccurrences(serviceTypeId: string, dateRange?: { start: Date; end: Date }) {
    // Mock implementation
    return [];
  }

  async getAttendance(serviceTypeId: string, occurrenceId: string) {
    // Mock implementation
    return [];
  }

  async importPeople() {
    // Mock implementation
    return { imported: 0 };
  }
}
