import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobsService } from '../../jobs.service';
import { PrismaService } from '../../../prisma/prisma.service';

interface ReportJobData {
  jobId: string;
  organizationId: string;
  type: 'attendance' | 'giving' | 'membership' | 'comprehensive';
  dateRange: { start: Date; end: Date };
  format?: 'pdf' | 'csv' | 'excel';
}

@Processor('report-generation')
export class ReportGeneratorProcessor extends WorkerHost {
  constructor(
    private jobsService: JobsService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<ReportJobData>): Promise<any> {
    const { jobId, organizationId, type, dateRange, format = 'pdf' } = job.data;

    try {
      await this.jobsService.updateStatus(jobId, 'PROCESSING');

      // Generate report based on type
      let reportData: any;

      switch (type) {
        case 'attendance':
          reportData = await this.generateAttendanceReport(organizationId, dateRange);
          break;
        case 'giving':
          reportData = await this.generateGivingReport(organizationId, dateRange);
          break;
        case 'membership':
          reportData = await this.generateMembershipReport(organizationId, dateRange);
          break;
        case 'comprehensive':
          reportData = await this.generateComprehensiveReport(organizationId, dateRange);
          break;
        default:
          throw new Error(`Unknown report type: ${type}`);
      }

      // In production, would generate actual PDF/CSV/Excel file
      const reportUrl = `https://reports.churchtech.com/${jobId}.${format}`;

      await this.jobsService.updateStatus(jobId, 'COMPLETED', {
        reportUrl,
        type,
        generatedAt: new Date(),
        ...reportData,
      });

      return { success: true, reportUrl };
    } catch (error) {
      await this.jobsService.updateStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async generateAttendanceReport(organizationId: string, dateRange: { start: Date; end: Date }) {
    const services = await this.prisma.service.findMany({
      where: {
        organizationId,
        scheduledAt: { gte: dateRange.start, lte: dateRange.end },
      },
      include: { attendances: true },
    });

    const totalAttendance = services.reduce((sum, s) =>
      sum + s.attendances.reduce((a, att) => a + att.count, 0), 0
    );

    const avgAttendance = services.length > 0 ? totalAttendance / services.length : 0;

    return {
      summary: { totalServices: services.length, totalAttendance, avgAttendance },
      services: services.map(s => ({
        name: s.name,
        date: s.scheduledAt,
        attendance: s.attendances.reduce((a, att) => a + att.count, 0),
      })),
    };
  }

  private async generateGivingReport(organizationId: string, dateRange: { start: Date; end: Date }) {
    const giving = await this.prisma.giving.findMany({
      where: {
        organizationId,
        createdAt: { gte: dateRange.start, lte: dateRange.end },
      },
      include: { campaign: true, member: true },
    });

    const totalGiving = giving.reduce((sum, g) => sum + Number(g.amount), 0);
    const byType = giving.reduce((acc, g) => {
      acc[g.type] = (acc[g.type] || 0) + Number(g.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: { totalTransactions: giving.length, totalGiving },
      byType,
      transactions: giving.map(g => ({
        date: g.createdAt,
        amount: Number(g.amount),
        type: g.type,
        donor: g.anonymous ? 'Anonymous' : g.member ? `${g.member.firstName} ${g.member.lastName}` : g.donorName,
        campaign: g.campaign?.name,
      })),
    };
  }

  private async generateMembershipReport(organizationId: string, dateRange: { start: Date; end: Date }) {
    const members = await this.prisma.member.findMany({
      where: { organizationId },
    });

    const activeMembers = members.filter(m => m.isActive);
    const newMembers = members.filter(m => m.memberSince >= dateRange.start && m.memberSince <= dateRange.end);

    return {
      summary: { totalMembers: members.length, activeMembers: activeMembers.length, newMembers: newMembers.length },
      members: activeMembers.map(m => ({
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        memberSince: m.memberSince,
        isActive: m.isActive,
      })),
    };
  }

  private async generateComprehensiveReport(organizationId: string, dateRange: { start: Date; end: Date }) {
    const [attendance, giving, membership] = await Promise.all([
      this.generateAttendanceReport(organizationId, dateRange),
      this.generateGivingReport(organizationId, dateRange),
      this.generateMembershipReport(organizationId, dateRange),
    ]);

    return { attendance, giving, membership, generatedAt: new Date() };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ReportJobData>, error: Error) {
    console.error(`Report job ${job.data.jobId} failed:`, error.message);
  }
}
