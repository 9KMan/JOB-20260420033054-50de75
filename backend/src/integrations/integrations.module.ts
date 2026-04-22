import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { MetaService } from './providers/meta.service';
import { ChurchSuiteService } from './providers/churchsuite.service';
import { PlanningCenterService } from './providers/planning-center.service';
import { CanvaService } from './providers/canva.service';
import { StripeService } from './providers/stripe.service';

@Module({
  providers: [
    IntegrationsService,
    MetaService,
    ChurchSuiteService,
    PlanningCenterService,
    CanvaService,
    StripeService,
  ],
  controllers: [IntegrationsController],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
