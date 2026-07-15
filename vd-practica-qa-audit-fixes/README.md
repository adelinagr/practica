# VD-Practica - SaaS Platform

A modern, full-stack SaaS platform for digitalization services built with Next.js, PostgreSQL, and AI integration.

## 🚀 Project Overview

**vreaudigitalizare.eu** is an enterprise-ready SaaS platform designed to:
- Generate leads for digitalization services
- Assess digital maturity of companies through interactive questionnaires
- Provide AI-assisted content generation (articles, questionnaires, recommendations)
- Manage a public website, blog, admin panel, and lead database

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Email**: Resend
- **Deployment**: Docker, GitHub Actions

## 📋 Features

### Public Website
- SEO-optimized homepage with CMS-managed sections
- Blog system with articles, categories, and tags
- Dynamic public questionnaires with scoring
- Lead capture forms
- Responsive mobile design

### Admin Panel
- Secure authentication with 2FA support
- Dashboard with analytics widgets
- Questionnaire builder with form editor
- Blog management with WYSIWYG editor
- Lead management and export
- AI Assistant for content generation
- Page/CMS administration
- Audit logging

### Core Modules
- **Authentication**: JWT-based with NextAuth.js
- **Questionnaire Engine**: Dynamic forms with conditional logic and scoring
- **AI Assistant**: OpenAI integration for content generation
- **Lead Management**: Capture, track, and export leads
- **Notifications**: Email system for alerts and reports
- **Analytics**: Dashboard with key metrics

## 🏗️ Project Structure

```
vd-practica/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Admin dashboard routes
│   ├── (public)/          # Public website routes
│   └── api/               # API routes
├── components/            # Reusable React components
├── lib/                   # Utilities and helpers
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
├── docker-compose.yml     # Docker services configuration
├── .env.example           # Environment variables template
└── .env.docker            # Docker-specific env example
```

## 🚀 Quick Start

### With Docker (Recommended)

```bash
# Start PostgreSQL and PgAdmin
docker-compose up -d

# Install dependencies
npm install

# Setup environment
cp .env.docker .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions.

### Without Docker

1. Set up PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`
3. Follow steps 3-4 above (starting from `npm install`)

## 📖 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Database Management

```bash
# Open Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in required values:

```bash
cp .env.example .env.local
```

Key variables:
- `NEXTAUTH_URL`: App URL (for NextAuth)
- `NEXTAUTH_SECRET`: Secret for token signing
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `RESEND_API_KEY`: Email service API key

## 🗄️ Database

Powered by PostgreSQL with Prisma ORM.

### Access PgAdmin
- **URL**: http://localhost:5050
- **Email**: admin@example.com
- **Password**: admin

## 🔐 Security

- JWT-based authentication
- NextAuth.js for session management
- Password hashing with bcrypt
- Input validation with Zod
- CSRF protection
- Role-based access control (RBAC)
- Audit logging for critical actions

## 📚 Documentation

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Docker setup guide
- Prisma schema: `prisma/schema.prisma`

## 🚢 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

## 🎯 Development Phases

See [Scope of Work](./SCOPE_OF_WORK.md) for complete roadmap and specifications.

---

**Status**: Foundation Phase - Ready for Development
