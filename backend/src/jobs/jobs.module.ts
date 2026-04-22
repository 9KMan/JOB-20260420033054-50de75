import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ReportGeneratorProcessor } from './processors/report-generator.processor';
import { AdCopyProcessor } from './processors/ad-copy.processor';
import { AttributionProcessor } from './processors/attribution.processor';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'report-generation' },
      { name: 'ad-copy' },
      { name: 'attribution' },
      { name: 'email' },
    ),
  ],
  providers: [
    JobsService,
    ReportGeneratorProcessor,
    AdCopyProcessor,
    AttributionProcessor,
    EmailProcessor,
  ],
  controllers: [JobsController],
  exports: [JobsService],
})
export class JobsModule {}
