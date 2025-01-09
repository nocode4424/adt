# Aurora File Schema

## Project Structure

```
aurora/
├── src/                      # Source code
│   ├── app/                  # Next.js app directory
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── analytics/       # Analytics components
│   │   ├── assets/         # Asset management components
│   │   ├── auth/           # Authentication components
│   │   ├── calendar/       # Calendar components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── expenses/       # Expense tracking components
│   │   ├── incidents/      # Incident tracking components
│   │   ├── layout/         # Layout components
│   │   ├── notifications/  # Notification components
│   │   ├── sharing/        # Sharing components
│   │   └── ui/            # Reusable UI components
│   ├── lib/                # Utility functions and hooks
│   │   ├── api/           # API functions
│   │   ├── calendar/      # Calendar utilities
│   │   ├── export/        # Export utilities
│   │   ├── hooks/         # Custom React hooks
│   │   ├── middleware/    # Middleware functions
│   │   ├── supabase/     # Supabase client and utilities
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # General utilities
│   └── pages/             # Page components
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/               # Test files

## Key Files

### Configuration Files
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `eslint.config.js`: ESLint configuration
- `.env`: Environment variables

### Core Application Files
- `src/app/layout.tsx`: Root layout component
- `src/app/page.tsx`: Home page component
- `src/lib/supabase.ts`: Supabase client configuration
- `src/lib/openai.ts`: OpenAI integration
- `src/lib/cache.ts`: Caching utilities

### Component Categories

#### Authentication Components
- `src/components/auth/AuthProvider.tsx`: Authentication context provider
- `src/components/auth/LoginForm.tsx`: Login form component
- `src/components/auth/RegisterForm.tsx`: Registration form component
- `src/components/auth/ForgotPasswordForm.tsx`: Password reset form

#### Incident Management
- `src/components/incidents/IncidentForm.tsx`: Incident creation form
- `src/components/incidents/IncidentList.tsx`: Incident list display
- `src/components/incidents/IncidentTimeline.tsx`: Timeline view

#### Expense Tracking
- `src/components/expenses/ExpenseForm.tsx`: Expense entry form
- `src/components/expenses/ExpenseList.tsx`: Expense list display
- `src/components/expenses/ExpenseChart.tsx`: Expense visualization

#### UI Components
- `src/components/ui/Button.tsx`: Reusable button component
- `src/components/ui/Card.tsx`: Card container component
- `src/components/ui/Modal.tsx`: Modal dialog component
- `src/components/ui/LoadingSpinner.tsx`: Loading indicator

### Utility Functions

#### API Utilities
- `src/lib/api/auth.ts`: Authentication API functions
- `src/lib/api/incidents.ts`: Incident management API
- `src/lib/api/expenses.ts`: Expense tracking API

#### Hooks
- `src/lib/hooks/useAuth.ts`: Authentication hook
- `src/lib/hooks/useAsync.ts`: Async operation hook
- `src/lib/hooks/useOffline.ts`: Offline detection hook

#### Type Definitions
- `src/lib/types/common.ts`: Common type definitions
- `src/lib/types/supabase.ts`: Supabase database types
- `src/lib/types/incidents.ts`: Incident-related types

### Database Migrations
- `supabase/migrations/*.sql`: Database schema migrations

## File Naming Conventions

1. **Components**
   - PascalCase for component files (e.g., `Button.tsx`)
   - Include type in filename (e.g., `IncidentForm.tsx`)

2. **Utilities**
   - camelCase for utility files (e.g., `formatDate.ts`)
   - Use descriptive names (e.g., `validateInput.ts`)

3. **Types**
   - camelCase for type files (e.g., `types.ts`)
   - Suffix with `.d.ts` for declaration files

4. **Tests**
   - Match source file name with `.test` or `.spec` suffix
   - Example: `Button.test.tsx` for `Button.tsx`

## Code Organization Guidelines

1. **Components**
   - One component per file
   - Co-locate related components
   - Keep components focused and single-responsibility

2. **Hooks**
   - Separate custom hooks into their own files
   - Place in `hooks` directory
   - Prefix with `use` (e.g., `useAuth.ts`)

3. **Utilities**
   - Group related utilities in directories
   - Keep functions pure and testable
   - Document complex utilities

4. **Types**
   - Centralize shared types in `types` directory
   - Co-locate component-specific types
   - Use descriptive type names

## Import Organization

1. **Import Order**
   ```typescript
   // External dependencies
   import React from 'react';
   import { useQuery } from '@tanstack/react-query';

   // Internal utilities and types
   import { formatDate } from '@/lib/utils';
   import type { Incident } from '@/lib/types';

   // Components
   import { Button } from '@/components/ui';
   ```

2. **Path Aliases**
   - Use `@/` alias for src directory
   - Maintain consistent import paths
   - Avoid relative paths when possible

## Documentation Guidelines

1. **Component Documentation**
   ```typescript
   /**
    * Button component with various styles and states.
    *
    * @param variant - Button style variant
    * @param size - Button size
    * @param disabled - Disabled state
    */
   export function Button({ variant, size, disabled }: ButtonProps) {
     // ...
   }
   ```

2. **Type Documentation**
   ```typescript
   /**
    * Represents an incident record.
    *
    * @property id - Unique identifier
    * @property type - Incident type
    * @property description - Incident description
    */
   export interface Incident {
     id: string;
     type: string;
     description: string;
   }
   ```

## Testing Organization

1. **Test File Location**
   ```
   src/
   ├── components/
   │   ├── Button.tsx
   │   └── __tests__/
   │       └── Button.test.tsx
   ```

2. **Test File Structure**
   ```typescript
   describe('Button', () => {
     describe('rendering', () => {
       // Render tests
     });

     describe('interactions', () => {
       // Interaction tests
     });
   });
   ```
```