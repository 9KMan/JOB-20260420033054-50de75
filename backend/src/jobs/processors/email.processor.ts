import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { JobsService } from '../../jobs.service';
import { PrismaService } from '../../../prisma/prisma.service';

interface EmailJobData {
  jobId: string;
  organizationId: string;
  type: 'transactional' | 'marketing' | 'pastoral' | 'announcement';
  recipients: Array<{
    type: 'all_members' | 'group' | 'segment' | 'individual';
    ids?: string[];
  }>;
  template?: {
    id?: string;
    subject: string;
    body: string;
  };
  subject: string;
  body: string;
  scheduledFor?: Date;
}

interface EmailResult {
  sent: number;
  failed: number;
  errors?: string[];
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private resendApiKey: string;
  private fromEmail: string;

  constructor(
    private configService: ConfigService,
    private jobsService: JobsService,
    private prisma: PrismaService,
  ) {
    super();
    this.resendApiKey = this.configService.get('RESEND_API_KEY', '');
    this.fromEmail = this.configService.get('RESEND_FROM_EMAIL', 'onboarding@resend.com');
  }

  async process(job: Job<EmailJobData>): Promise<any> {
    const { jobId, organizationId, type, recipients, subject, body } = job.data;

    try {
      await this.jobsService.updateStatus(jobId, 'PROCESSING');

      // Get recipient emails based on type
      const recipientEmails = await this.getRecipientEmails(organizationId, recipients);

      // Send emails (in production, use Resend API)
      const result = await this.sendEmails(recipientEmails, subject, body, type);

      await this.jobsService.updateStatus(jobId, 'COMPLETED', {
        ...result,
        sentAt: new Date(),
      });

      return { success: true, ...result };
    } catch (error) {
      await this.jobsService.updateStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async getRecipientEmails(
    organizationId: string,
    recipients: EmailJobData['recipients'],
  ): Promise<string[]> {
    const emails: string[] = [];

    for (const recipient of recipients) {
      switch (recipient.type) {
        case 'all_members':
          const members = await this.prisma.member.findMany({
            where: { organizationId, isActive: true, email: { not: null } },
            select: { email: true },
          });
          emails.push(...members.map(m => m.email!).filter(Boolean));
          break;

        case 'group':
          // Would fetch members in a specific group
          break;

        case 'segment':
          // Would fetch members matching segment criteria
          break;

        case 'individual':
          if (recipient.ids) {
            const users = await this.prisma.user.findMany({
              where: { id: { in: recipient.ids } },
              select: { email: true },
            });
            emails.push(...users.map(u => u.email));
          }
          break;
      }
    }

    // Remove duplicates
    return [...new Set(emails)];
  }

  private async sendEmails(
    emails: string[],
    subject: string,
    body: string,
    type: string,
  ): Promise<EmailResult> {
    // In production, use Resend API to send emails
    // For now, mock the sending
    const result: EmailResult = {
      sent: emails.length,
      failed: 0,
    };

    console.log(`[EmailProcessor] Sending ${type} email to ${emails.length} recipients`);
    console.log(`[EmailProcessor] Subject: ${subject}`);

    // Simulate API call
    if (!this.resendApiKey || this.resendApiKey === 're_xxxx') {
      console.log('[EmailProcessor] Warning: Resend API not configured, skipping actual send');
    }

    return result;
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<EmailJobData>, error: Error) {
    console.error(`Email job ${job.data.jobId} failed:`, error.message);
  }
}
