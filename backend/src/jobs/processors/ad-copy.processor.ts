import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { JobsService } from '../../jobs.service';
import { PrismaService } from '../../../prisma/prisma.service';

interface AdCopyJobData {
  jobId: string;
  organizationId: string;
  campaignId?: string;
  type: 'facebook' | 'instagram' | 'google' | 'all';
  goal: 'awareness' | 'engagement' | 'conversion';
  audience?: {
    ageRange?: { min: number; max: number };
    location?: string;
    interests?: string[];
  };
}

interface GeneratedAdCopy {
  headline: string;
  body: string;
  cta: string;
  imagePrompt?: string;
}

@Processor('ad-copy')
export class AdCopyProcessor extends WorkerHost {
  private openAiApiKey: string;

  constructor(
    private configService: ConfigService,
    private jobsService: JobsService,
    private prisma: PrismaService,
  ) {
    super();
    this.openAiApiKey = this.configService.get('OPENAI_API_KEY', '');
  }

  async process(job: Job<AdCopyJobData>): Promise<any> {
    const { jobId, organizationId, type, goal, audience } = job.data;

    try {
      await this.jobsService.updateStatus(jobId, 'PROCESSING');

      // Get organization and campaign details
      const organization = await this.prisma.organization.findUnique({
        where: { id: organizationId },
      });

      let campaign = null;
      if (job.data.campaignId) {
        campaign = await this.prisma.campaign.findUnique({
          where: { id: job.data.campaignId },
        });
      }

      // Generate ad copy based on parameters
      const adCopies = await this.generateAdCopies({
        organizationName: organization?.name || 'Our Church',
        campaignGoal: campaign?.name,
        type,
        goal,
        audience,
      });

      await this.jobsService.updateStatus(jobId, 'COMPLETED', {
        ads: adCopies,
        generatedAt: new Date(),
      });

      return { success: true, ads: adCopies };
    } catch (error) {
      await this.jobsService.updateStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async generateAdCopies(params: {
    organizationName: string;
    campaignGoal?: string;
    type: string;
    goal: string;
    audience?: any;
  }): Promise<GeneratedAdCopy[]> {
    // In production, this would call OpenAI API
    // For now, return template-based ad copies

    const goalCopy = {
      awareness: {
        headlines: [
          `Welcome to ${params.organizationName}`,
          `Find Community at ${params.organizationName}`,
          `${params.organizationName} - A Place for Everyone`,
        ],
        body: `Join us this Sunday! Experience welcoming community, inspiring worship, and meaningful connections. {location}\n\n#LIVE`,
        cta: 'Learn More',
      },
      engagement: {
        headlines: [
          `Get Involved at ${params.organizationName}`,
          `Join a Small Group Today`,
          `${params.organizationName} - Grow Together`,
        ],
        body: `Life is better together. Discover opportunities to connect, serve, and grow in faith. {location}\n\n#LIVE`,
        cta: 'Join Us',
      },
      conversion: {
        headlines: [
          `Give Online at ${params.organizationName}`,
          `Support ${params.organizationName}'s Mission`,
          `${params.organizationName} - Make a Difference`,
        ],
        body: `Your generosity makes a kingdom impact. Partner with us to transform lives and community. {location}\n\n#LIVE`,
        cta: 'Give Now',
      },
    };

    const templates = goalCopy[params.goal as keyof typeof goalCopy] || goalCopy.awareness;

    return templates.headlines.map((headline, index) => ({
      headline,
      body: templates.body.replace('{location}', params.campaignGoal ? `Supporting: ${params.campaignGoal}` : ''),
      cta: templates.cta,
      imagePrompt: `Modern church imagery, welcoming atmosphere, ${params.type} ad format`,
      platform: params.type === 'all' ? ['facebook', 'instagram', 'google'][index % 3] : params.type,
    }));
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<AdCopyJobData>, error: Error) {
    console.error(`Ad copy job ${job.data.jobId} failed:`, error.message);
  }
}
