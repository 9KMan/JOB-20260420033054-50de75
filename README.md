# Church-Tech SaaS

Modern church management platform with giving, attendance, and engagement tools.

## Features

- **Multi-tenant Architecture**: Each church gets its own subdomain and isolated data
- **Member Management**: Track members, groups, and visitor follow-up
- **Online Giving**: Integrated payment processing with Stripe
- **Attendance Tracking**: Monitor attendance trends with comprehensive analytics
- **Smart Notifications**: Send targeted messages via SMS, email, and push
- **AI-Powered Ad Copy**: Generate marketing content with OpenAI
- **Attribution Reporting**: Track campaign effectiveness across channels
- **Integration Hub**: Connect with Meta Ads, ChurchSuite, Planning Center, Canva
- **Real-time Dashboards**: Visualize church health with comprehensive metrics

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **State Management**: TanStack Query
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Job Queue**: BullMQ + Redis
- **Authentication**: Passport JWT
- **API Documentation**: Swagger/OpenAPI
- **Payments**: Stripe
- **SMS**: Twilio
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/9KMan/JOB-20260420033054-50de75.git
cd church-tech-saas
```

2. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Start with Docker Compose:
```bash
docker-compose up -d
```

4. For local development:
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/docs

## Project Structure

```
church-tech-saas/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── api/            # API routes
│   │   └── dashboard/      # Dashboard pages
│   ├── components/         # React components
│   │   ├── ui/             # UI primitives
│   │   ├── layout/         # Layout components
│   │   └── dashboard/      # Dashboard widgets
│   └── lib/                # Utilities
│
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── churches/       # Church management
│   │   ├── users/          # User management
│   │   ├── integrations/   # Third-party integrations
│   │   │   └── providers/  # Integration providers
│   │   └── jobs/           # Background job processing
│   │       └── processors/ # Job processors
│   └── prisma/             # Database schema
│
├── docker-compose.yml      # Docker orchestration
├── README.md               # This file
└── SPEC.md                 # Architecture specification
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new church and user
- `POST /api/auth/login` - Login with email/password

### Churches
- `GET /api/churches/me` - Get current church
- `PATCH /api/churches/me` - Update church
- `GET /api/churches/stats` - Get church statistics
- `GET /api/churches/:subdomain` - Get church by subdomain

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Integrations
- `GET /api/integrations` - List integrations
- `POST /api/integrations` - Create integration
- `POST /api/integrations/:id/sync` - Sync integration

### Jobs
- `GET /api/jobs` - List jobs
- `GET /api/jobs/metrics` - Get job metrics
- `POST /api/jobs/:id/retry` - Retry job
- `DELETE /api/jobs/:id` - Cancel job

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_HOST` | Redis host | Yes |
| `REDIS_PORT` | Redis port | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe API key | No |
| `RESEND_API_KEY` | Resend email API key | No |
| `TWILIO_*` | Twilio SMS credentials | No |
| `META_*` | Meta Ads credentials | No |
| `OPENAI_API_KEY` | OpenAI API key | No |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |

## License

MIT License - See LICENSE file for details.
