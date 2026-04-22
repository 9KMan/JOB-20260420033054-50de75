import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Organization } from '@prisma/client';

@Injectable()
export class ChurchesService {
  constructor(private prisma: PrismaService) {}

  async findBySubdomain(subdomain: string): Promise<Organization> {
    const church = await this.prisma.organization.findUnique({
      where: { subdomain },
    });

    if (!church) {
      throw new NotFoundException('Church not found');
    }

    return church;
  }

  async findById(id: string): Promise<Organization> {
    const church = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!church) {
      throw new NotFoundException('Church not found');
    }

    return church;
  }

  async update(
    id: string,
    data: Partial<Omit<Organization, 'id' | 'createdAt'>>,
  ): Promise<Organization> {
    const church = await this.prisma.organization.findUnique({ where: { id } });

    if (!church) {
      throw new NotFoundException('Church not found');
    }

    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async getStats(id: string) {
    const [
      memberCount,
      recentGiving,
      upcomingServices,
      integrationCount,
    ] = await Promise.all([
      this.prisma.member.count({
        where: { organizationId: id, isActive: true },
      }),
      this.prisma.giving.aggregate({
        where: { organizationId: id },
        _sum: { amount: true },
      }),
      this.prisma.service.count({
        where: {
          organizationId: id,
          scheduledAt: { gte: new Date() },
        },
      }),
      this.prisma.integration.count({
        where: { organizationId: id, isActive: true },
      }),
    ]);

    return {
      memberCount,
      totalGiving: recentGiving._sum.amount || 0,
      upcomingServices,
      integrationCount,
    };
  }
}
