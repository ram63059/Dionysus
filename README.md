# DIONYSUS

*An AI-powered project management and code analysis platform*

[![License](https://img.shields.io/github/license/ram63059/Dionysus?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/ram63059/Dionysus?style=default&logo=git&logoColor=white&color=0080ff)](https://github.com/ram63059/Dionysus/commits)
[![Top Language](https://img.shields.io/github/languages/top/ram63059/Dionysus?style=default&color=0080ff)](https://github.com/ram63059/Dionysus)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

Dionysus is a comprehensive project management platform that leverages AI to analyze codebases, manage meetings, and provide intelligent insights for development teams. Built with Next.js 14, it integrates with GitHub for code analysis, uses AI for meeting transcription and summarization, and provides a modern dashboard for project oversight.

## Features

- **🤖 AI-Powered Code Analysis**: Automated codebase analysis with intelligent insights
- **📊 Project Dashboard**: Comprehensive overview of project metrics and team activity
- **🎯 Meeting Management**: AI-powered meeting transcription, summarization, and action item extraction
- **👥 Team Collaboration**: Real-time collaboration tools with role-based access control
- **🔗 GitHub Integration**: Seamless repository connection and commit tracking
- **💳 Subscription Management**: Stripe-powered billing and subscription handling
- **📱 Responsive Design**: Mobile-first design with modern UI components
- **🔐 Secure Authentication**: Clerk-powered authentication with social login options

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Clerk
- **AI/ML**: Google Gemini, AssemblyAI
- **Payments**: Stripe
- **Storage**: Firebase
- **Deployment**: Vercel (recommended)

## Project Structure

```
Dionysus/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (protected)/        # Protected routes
│   │   ├── api/                # API routes
│   │   └── _components/        # Page-specific components
│   ├── components/             # Reusable UI components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries and configurations
│   ├── server/                 # Server-side code
│   │   └── api/                # tRPC API routes
│   └── styles/                 # Global styles
├── prisma/                     # Database schema and migrations
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **GitHub** account for repository integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ram63059/Dionysus.git
   cd Dionysus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Start the database (if using Docker)
   ./start-database.sh
   
   # Run database migrations
   npx prisma migrate dev
   npx prisma generate
   ```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# AI Services
GEMINI_API_KEY="your_gemini_api_key"
ASSEMBLY_AI_API_KEY="your_assembly_ai_key"

# GitHub Integration
GITHUB_TOKEN="your_github_personal_access_token"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# Firebase
FIREBASE_PROJECT_ID="your_firebase_project_id"
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL="your_firebase_client_email"

# Supabase
SUPABASE_URL="your_supabase_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### Usage

1. **Development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

3. **Database operations**
   ```bash
   # View database in Prisma Studio
   npx prisma studio
   
   # Reset database
   npx prisma migrate reset
   ```

## API Endpoints

### REST API
- `POST /api/process-meeting` - Process meeting recordings
- `POST /api/webhook/stripe` - Stripe webhook handler

### tRPC API
- `project.*` - Project management operations
- `post.*` - Content management operations

Access the tRPC API at `/api/trpc/[trpc]`

## Key Features Walkthrough

### Project Management
- Create and manage multiple projects
- Invite team members with role-based permissions
- Track project progress and metrics

### AI-Powered Insights
- Automated code analysis and quality assessment
- Meeting transcription with action item extraction
- Intelligent project recommendations

### Integration Capabilities
- GitHub repository synchronization
- Real-time commit tracking
- Automated code review insights

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@dionysus.dev](mailto:support@dionysus.dev)
- 💬 [GitHub Discussions](https://github.com/ram63059/Dionysus/discussions)
- 🐛 [Report Issues](https://github.com/ram63059/Dionysus/issues)

---

Built with ❤️ by the Dionysus team
