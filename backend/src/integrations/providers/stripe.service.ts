import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Integration } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY', ''), {
      apiVersion: '2023-10-16',
    });
  }

  async sync(integration: Integration) {
    // Sync Stripe data
    const mockData = {
      customers: [],
      transactions: [],
      subscriptions: [],
      lastSync: new Date(),
    };

    await this.prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    return mockData;
  }

  async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
    return this.stripe.customers.create({
      email,
      name,
      metadata,
    });
  }

  async getCustomer(customerId: string) {
    return this.stripe.customers.retrieve(customerId);
  }

  async createDonation(customerId: string, amount: number, currency: string = 'usd', metadata?: Record<string, string>) {
    return this.stripe.charges.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata,
    });
  }

  async createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
  }

  async getTransactions(limit: number = 100) {
    const charges = await this.stripe.charges.list({ limit });
    return charges.data;
  }

  async createCheckoutSession(items: Array<{ priceId: string; quantity: number }>, successUrl: string, cancelUrl: string) {
    return this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async constructWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET', '');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
