import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobsService } from '../../jobs.service';
import { PrismaService } from '../../../prisma/prisma.service';

interface AttributionJobData {
  jobId: string;
  organizationId: string;
  campaignId?: string;
  dateRange: { start: Date; end: Date };
  touchpoints: Array<{
    type: 'facebook' | 'instagram' | 'google' | 'email' | 'sms' | 'in_person';
    campaignName: string;
    spend: number;
  }>;
}

interface AttributionResult {
  touchpoints: Array<{
    type: string;
    campaignName: string;
    spend: number;
    conversions: number;
    revenue: number;
    roas: number;
    attribution: 'first_click' | 'last_click' | 'linear' | 'time_decay';
  }>;
  totalConversions: number;
  totalRevenue: number;
  overallROAS: number;
  recommendations: string[];
}

@Processor('attribution')
export class AttributionProcessor extends WorkerHost {
  constructor(
    private jobsService: JobsService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<AttributionJobData>): Promise<any> {
    const { jobId, organizationId, campaignId, dateRange, touchpoints } = job.data;

    try {
      await this.jobsService.updateStatus(jobId, 'PROCESSING');

      // Get giving data for the period
      const givingData = await this.prisma.giving.findMany({
        where: {
          organizationId,
          createdAt: { gte: dateRange.start, lte: dateRange.end },
          ...(campaignId ? { campaignId } : {}),
        },
        include: { campaign: true },
      });

      // Calculate attribution for each touchpoint
      const attributedTouchpoints = this.calculateAttribution(touchpoints, givingData);

      // Generate recommendations
      const recommendations = this.generateRecommendations(attributedTouchpoints, givingData);

      const result: AttributionResult = {
        touchpoints: attributedTouchpoints,
        totalConversions: givingData.length,
        totalRevenue: givingData.reduce((sum, g) => sum + Number(g.amount), 0),
        overallROAS: this.calculateOverallROAS(touchpoints, givingData),
        recommendations,
      };

      await this.jobsService.updateStatus(jobId, 'COMPLETED', result);

      return { success: true, ...result };
    } catch (error) {
      await this.jobsService.updateStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private calculateAttribution(
    touchpoints: AttributionJobData['touchpoints'],
    givingData: any[],
  ): AttributionResult['touchpoints'] {
    // Simple linear attribution model
    const totalSpend = touchpoints.reduce((sum, t) => sum + t.spend, 0);
    const totalRevenue = givingData.reduce((sum, g) => sum + Number(g.amount), 0);

    return touchpoints.map(touchpoint => {
      const weight = touchpoint.spend / totalSpend;
      const attributedRevenue = totalRevenue * weight;
      const conversions = Math.round(givingData.length * weight);

      return {
        type: touchpoint.type,
        campaignName: touchpoint.campaignName,
        spend: touchpoint.spend,
        conversions,
        revenue: Math.round(attributedRevenue * 100) / 100,
        roas: touchpoint.spend > 0 ? Math.round((attributedRevenue / touchpoint.spend) * 100) / 100 : 0,
        attribution: 'linear' as const,
      };
    });
  }

  private calculateOverallROAS(touchpoints: AttributionJobData['touchpoints'], givingData: any[]): number {
    const totalSpend = touchpoints.reduce((sum, t) => sum + t.spend, 0);
    const totalRevenue = givingData.reduce((sum, g) => sum + Number(g.amount), 0);
    return totalSpend > 0 ? Math.round((totalRevenue / totalSpend) * 100) / 100 : 0;
  }

  private generateRecommendations(touchpoints: AttributionResult['touchpoints'], givingData: any[]): string[] {
    const recommendations: string[] = [];

    // Find best performing touchpoint
    const bestROAS = touchpoints.reduce((best, t) => (t.roas > best.roas ? t : best), touchpoints[0]);
    if (bestROAS) {
      recommendations.push(
        `Consider increasing budget for ${bestROAS.campaignName} (${bestROAS.type}) which has the highest ROAS of ${bestROAS.roas}x`,
      );
    }

    // Find underperforming touchpoints
    const lowROAS = touchpoints.filter(t => t.roas < 1);
    if (lowROAS.length > 0) {
      recommendations.push(
        `${lowROAS.length} touchpoint(s) have ROAS below 1x. Consider optimizing or reallocating budget.`,
      );
    }

    // Check for missing channels
    const channels = touchpoints.map(t => t.type);
    if (!channels.includes('email')) {
      recommendations.push('Email marketing is not being tracked. Consider adding email touchpoints for better attribution.');
    }

    // General recommendation
    if (givingData.length < 10) {
      recommendations.push('Conversion data is limited. Consider running campaigns longer to gather more attribution data.');
    }

    return recommendations;
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<AttributionJobData>, error: Error) {
    console.error(`Attribution job ${job.data.jobId} failed:`, error.message);
  }
}
