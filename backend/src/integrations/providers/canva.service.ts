import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Integration } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

interface CanvaDesign {
  id: string;
  title: string;
  thumbnailUrl: string;
  editUrl: string;
  createdAt: string;
}

@Injectable()
export class CanvaService {
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get('CANVA_API_KEY', '');
  }

  async sync(integration: Integration) {
    // In production, sync with Canva API
    const mockData = {
      designs: [] as CanvaDesign[],
      lastSync: new Date(),
    };

    await this.prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    return mockData;
  }

  async getDesigns() {
    // Mock implementation
    return [];
  }

  async createDesign(designData: { title: string; templateId?: string }) {
    // Mock implementation
    return {
      id: `design_${Date.now()}`,
      title: designData.title,
      thumbnailUrl: '',
      editUrl: '',
      createdAt: new Date().toISOString(),
    };
  }

  async getDesign(designId: string) {
    // Mock implementation
    return null;
  }

  async exportDesign(designId: string, format: 'PNG' | 'JPG' | 'PDF') {
    // Mock implementation
    return { exportUrl: '', format };
  }

  async duplicateDesign(designId: string) {
    // Mock implementation
    return { id: `design_${Date.now()}` };
  }
}
