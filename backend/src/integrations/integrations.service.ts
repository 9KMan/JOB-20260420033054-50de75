import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IntegrationType } from '@prisma/client';
import { MetaService } from './providers/meta.service';
import { ChurchSuiteService } from './providers/churchsuite.service';
import { PlanningCenterService } from './providers/planning-center.service';
import { CanvaService } from './providers/canva.service';
import { StripeService } from './providers/stripe.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private metaService: MetaService,
    private churchSuiteService: ChurchSuiteService,
    private planningCenterService: PlanningCenterService,
    private canvaService: CanvaService,
    private stripeService: StripeService,
  ) {}

  async findAll(organizationId: string) {
    return this.prisma.integration.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  async findByType(organizationId: string, type: IntegrationType) {
    return this.prisma.integration.findFirst({
      where: { organizationId, type, isActive: true },
    });
  }

  async create(
    organizationId: string,
    data: {
      type: IntegrationType;
      name: string;
      apiKey?: string;
      apiSecret?: string;
      accessToken?: string;
      refreshToken?: string;
      config?: any;
    },
  ) {
    return this.prisma.integration.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async update(id: string, data: any) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return this.prisma.integration.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    await this.prisma.integration.delete({ where: { id } });
    return { success: true };
  }

  async sync(id: string) {
    const integration = await this.findById(id);

    switch (integration.type) {
      case 'META':
        return this.metaService.sync(integration);
      case 'CHURCHSUITE':
        return this.churchSuiteService.sync(integration);
      case 'PLANNING_CENTER':
        return this.planningCenterService.sync(integration);
      case 'CANVA':
        return this.canvaService.sync(integration);
      case 'STRIPE':
        return this.stripeService.sync(integration);
      default:
        throw new Error(`Unknown integration type: ${integration.type}`);
    }
  }

  async getProvider(type: IntegrationType) {
    switch (type) {
      case 'META':
        return this.metaService;
      case 'CHURCHSUITE':
        return this.churchSuiteService;
      case 'PLANNING_CENTER':
        return this.planningCenterService;
      case 'CANVA':
        return this.canvaService;
      case 'STRIPE':
        return this.stripeService;
      default:
        throw new Error(`Unknown integration type: ${type}`);
    }
  }
}
