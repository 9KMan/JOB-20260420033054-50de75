# Church-Tech SaaS Architecture Specification

## Overview

Church-Tech SaaS is a multi-tenant church management platform designed to help churches streamline operations, engage members, and grow their communities.

## Architecture

### Multi-Tenancy Strategy

We use a **subdomain-based multi-tenancy** model where each church organization receives a unique subdomain (e.g., `gracecommunity.churchtech.com`). All data is isolated at the organization level using Row-Level Security (RLS) in PostgreSQL and explicit organizationId foreign keys.

#### Multi-tenancy Benefits:
- Complete data isolation between churches
- Custom branding per church (logo, colors, subdomain)
- Independent configuration per organization
- Simple deployment and operations

### Frontend Architecture

#### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js with JWT strategy
- **Charts**: Recharts

#### Directory Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── api/               # API routes (proxies to backend)
│   ├── dashboard/         # Protected dashboard pages
│   └── church/[subdomain]/ # Public church pages
├── components/
│   ├── ui/               # Primitive UI components
│   ├── layout/           # Layout components (nav, footer)
│   └── dashboard/        # Dashboard widgets
└── lib/                  # Utilities and hooks
```

#### Key Design Patterns

1. **Server Components**: Default for data fetching, client components for interactivity
2. **Client Components**: Marked with 'use client' directive
3. **API Routes**: Proxy requests to backend API
4. **Environment Variables**: `NEXT_PUBLIC_*` for client-side config

### Backend Architecture

#### Technology Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 16 with Prisma ORM
- **Job Queue**: BullMQ with Redis
- **Authentication**: Passport.js with JWT
- **API Documentation**: Swagger/OpenAPI

#### Module Structure
```
backend/src/
├── auth/                  # Authentication
│   ├── decorators/       # Custom decorators (Roles, CurrentUser)
│   ├── guards/            # Auth guards
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── jwt.strategy.ts
├── churches/             # Organization/church management
├── users/                # User management
├── integrations/         # Third-party integrations
│   └── providers/        # Integration implementations
├── jobs/                 # Background job processing
│   └── processors/       # Job type processors
└── prisma/               # Database service
```

#### API Design

RESTful API with:
- JWT Bearer token authentication
- Global prefix `/api`
- Validation pipes for DTOs
- Swagger documentation at `/docs`

### Database Schema

#### Core Entities

**Organization**
- Multi-tenant root entity
- Contains church-specific settings
- Subdomain for public pages

**User**
- Belongs to one Organization
- Roles: OWNER, ADMIN, MEMBER
- JWT-based authentication

**Member**
- Church members/attendees
- Belongs to one Organization
- Optional link to User account

**Service**
- Church services/events
- Has many Attendance records

**Giving**
- Donations and tithes
- Links to Member (if known donor)
- Links to Campaign (if applicable)

**Integration**
- Third-party service connections
- Per-organization configuration
- Encrypted credential storage

**Job**
- Background job tracking
- Supports retry logic
- Multiple job types

#### Indexes
- Organization: subdomain (unique), name
- User: email (unique), organizationId
- Member: email, organizationId, lastName
- Service: scheduledAt, organizationId
- Attendance: serviceId, organizationId
- Giving: memberId, campaignId, organizationId, createdAt
- Integration: organizationId, type
- Job: status, organizationId, type

### Security

1. **Authentication**: JWT tokens with 7-day expiry
2. **Password Security**: bcrypt with salt rounds
3. **API Authorization**: Role-based access control (RBAC)
4. **Data Isolation**: OrganizationId on all tenant data
5. **Input Validation**: class-validator DTOs
6. **CORS**: Configured for frontend origins
7. **Secrets Management**: Environment variables (production: use vault)

### Background Jobs

#### Job Types
1. **REPORT_GENERATION**: Generate PDF/CSV reports
2. **AD_COPY**: AI-powered marketing copy generation
3. **ATTRIBUTION**: Campaign attribution analysis
4. **EMAIL**: Bulk email sending

#### Queue Architecture
- Redis-backed BullMQ queues
- Separate queues per job type
- Configurable retry logic
- Dead letter queue for failed jobs

### Integration Providers

#### Meta Ads
- Ad campaign management
- Performance insights
- Pixel event tracking
- Conversion attribution

#### Stripe
- Customer management
- One-time donations
- Recurring subscriptions
- Webhook handling

#### ChurchSuite
- People sync
- Group management
- Attendance tracking

#### Planning Center
- People sync
- Service types
- Attendance records

#### Canva
- Design management
- Template creation
- Export capabilities

### Deployment

#### Docker Compose (Development)
- PostgreSQL 16
- Redis 7
- Backend (Node 20)
- Frontend (Node 20)

#### Production Considerations
- Use managed PostgreSQL (RDS, Cloud SQL)
- Use managed Redis (Elasticache, Memorystore)
- Container orchestration (ECS, Kubernetes)
- CDN for static assets
- Load balancer with SSL termination
- Environment-specific configurations
- Monitoring and alerting (DataDog, Sentry)
- Backup and disaster recovery

### Environment Variables

See README.md for complete variable list.

### Future Enhancements

1. **Mobile Apps**: React Native wrappers
2. **Real-time Features**: WebSocket notifications
3. **Advanced Analytics**: Machine learning insights
4. **API Rate Limiting**: Per-organization quotas
5. **Webhook Events**: Outbound event system
6. **Audit Logging**: Comprehensive audit trail
7. **File Storage**: S3 for documents/media
