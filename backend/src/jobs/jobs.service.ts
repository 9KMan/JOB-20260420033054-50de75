import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { JobType, JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue('report-generation') private reportQueue: Queue,
    @InjectQueue('ad-copy') private adCopyQueue: Queue,
    @InjectQueue('attribution') private attributionQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async findAll(organizationId: string) {
    return this.prisma.job.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findById(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async create(
    organizationId: string,
    userId: string,
    type: JobType,
    data: any,
    scheduledFor?: Date,
  ) {
    const job = await this.prisma.job.create({
      data: {
        type,
        status: 'PENDING',
        data,
        scheduledFor,
        organizationId,
        userId,
      },
    });

    // Add to appropriate queue
    await this.addToQueue(type, job.id, data, scheduledFor);

    return job;
  }

  private async addToQueue(type: JobType, jobId: string, data: any, scheduledFor?: Date) {
    const queue = this.getQueue(type);
    const jobData = { jobId, ...data };

    if (scheduledFor) {
      const delay = scheduledFor.getTime() - Date.now();
      await queue.add(type, jobData, { delay });
    } else {
      await queue.add(type, jobData);
    }
  }

  private getQueue(type: JobType): Queue {
    switch (type) {
      case 'REPORT_GENERATION':
        return this.reportQueue;
      case 'AD_COPY':
        return this.adCopyQueue;
      case 'ATTRIBUTION':
        return this.attributionQueue;
      case 'EMAIL':
        return this.emailQueue;
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  }

  async updateStatus(id: string, status: JobStatus, result?: any, error?: string) {
    return this.prisma.job.update({
      where: { id },
      data: {
        status,
        result,
        error,
        ...(status === 'PROCESSING' ? { startedAt: new Date() } : {}),
        ...(status === 'COMPLETED' || status === 'FAILED' ? { completedAt: new Date() } : {}),
      },
    });
  }

  async retry(id: string) {
    const job = await this.findById(id);

    if (job.attempts >= job.maxAttempts) {
      throw new Error('Max attempts reached');
    }

    await this.updateStatus(id, 'PENDING');

    await this.addToQueue(job.type, job.id, job.data as any);

    return job;
  }

  async cancel(id: string) {
    const job = await this.findById(id);

    await this.updateStatus(id, 'FAILED', null, 'Cancelled by user');

    return job;
  }

  async getMetrics(organizationId: string) {
    const [total, pending, processing, completed, failed] = await Promise.all([
      this.prisma.job.count({ where: { organizationId } }),
      this.prisma.job.count({ where: { organizationId, status: 'PENDING' } }),
      this.prisma.job.count({ where: { organizationId, status: 'PROCESSING' } }),
      this.prisma.job.count({ where: { organizationId, status: 'COMPLETED' } }),
      this.prisma.job.count({ where: { organizationId, status: 'FAILED' } }),
    ]);

    return { total, pending, processing, completed, failed };
  }
}
