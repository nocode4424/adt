# Aurora - Divorce Documentation Assistant

## Overview

Aurora is a secure, user-friendly application designed to help individuals document and manage their divorce process. It provides tools for tracking incidents, expenses, assets, and important dates while ensuring data privacy and security.

## Features

- 🔒 Secure documentation storage
- 📝 Incident tracking with AI analysis
- 💰 Expense management
- 📅 Calendar integration
- 📱 Responsive design
- 🔄 Offline support
- 🔍 Advanced search capabilities

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aurora.git
   cd aurora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

### Frontend

- Next.js with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- Framer Motion for animations

### Backend

- Supabase for database and authentication
- OpenAI API for incident analysis
- Real-time subscriptions for updates

### Security Features

- End-to-end encryption for sensitive data
- Row Level Security (RLS) in Supabase
- Input sanitization
- Rate limiting
- Audit logging
- Regular backups

## API Documentation

### Authentication

```typescript
// Sign up
POST /auth/signup
{
  email: string;
  password: string;
}

// Sign in
POST /auth/signin
{
  email: string;
  password: string;
}
```

### Incidents

```typescript
// Create incident
POST /api/incidents
{
  type: 'verbal' | 'physical' | 'financial' | 'other';
  description: string;
  occurred_at: string;
  location?: string;
  sensitivity_level: 'high' | 'medium' | 'low';
}

// Get incidents
GET /api/incidents
Query parameters:
  - page: number
  - limit: number
  - type: string
  - startDate: string
  - endDate: string
```

### Expenses

```typescript
// Create expense
POST /api/expenses
{
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt_url?: string;
}

// Get expenses
GET /api/expenses
Query parameters:
  - page: number
  - limit: number
  - category: string
  - startDate: string
  - endDate: string
```

## Security Measures

### Data Protection

1. **Encryption**
   - All sensitive data is encrypted at rest
   - Secure transmission using HTTPS
   - End-to-end encryption for file uploads

2. **Authentication**
   - Email and password authentication
   - JWT tokens with short expiration
   - Rate limiting on auth endpoints

3. **Authorization**
   - Row Level Security (RLS) policies
   - Role-based access control
   - Resource ownership validation

4. **Input Validation**
   - Request validation using Zod
   - Input sanitization
   - File upload restrictions

### Backup System

1. **Automated Backups**
   - Daily incremental backups
   - Weekly full backups
   - 30-day retention period

2. **Backup Encryption**
   - AES-256 encryption for backups
   - Secure key management
   - Encrypted transfer to storage

3. **Recovery Process**
   - Point-in-time recovery
   - Automated recovery testing
   - Disaster recovery plan

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please email support@aurora-app.com or open an issue in the GitHub repository.