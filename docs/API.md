# Aurora API Documentation

## Authentication

All API endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

```typescript
POST /auth/register
Request:
{
  email: string;
  password: string;
}
Response:
{
  user: User;
  session: Session;
}

POST /auth/login
Request:
{
  email: string;
  password: string;
}
Response:
{
  user: User;
  session: Session;
}

POST /auth/logout
Response:
{
  success: boolean;
}
```

#### Incidents

```typescript
GET /api/incidents
Query Parameters:
  - page: number
  - limit: number
  - type: string
  - startDate: string
  - endDate: string
Response:
{
  items: Incident[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

POST /api/incidents
Request:
{
  type: 'verbal' | 'physical' | 'financial' | 'other';
  description: string;
  occurred_at: string;
  location?: string;
  sensitivity_level: 'high' | 'medium' | 'low';
  metadata?: Record<string, any>;
}
Response:
{
  incident: Incident;
}

PUT /api/incidents/:id
Request:
{
  type?: string;
  description?: string;
  occurred_at?: string;
  location?: string;
  sensitivity_level?: string;
  metadata?: Record<string, any>;
}
Response:
{
  incident: Incident;
}

DELETE /api/incidents/:id
Response:
{
  success: boolean;
}
```

#### Expenses

```typescript
GET /api/expenses
Query Parameters:
  - page: number
  - limit: number
  - category: string
  - startDate: string
  - endDate: string
Response:
{
  items: Expense[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

POST /api/expenses
Request:
{
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
}
Response:
{
  expense: Expense;
}

PUT /api/expenses/:id
Request:
{
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
}
Response:
{
  expense: Expense;
}

DELETE /api/expenses/:id
Response:
{
  success: boolean;
}
```

#### Calendar

```typescript
GET /api/calendar/events
Query Parameters:
  - startDate: string
  - endDate: string
  - type: string
Response:
{
  events: CalendarEvent[];
}

POST /api/calendar/events
Request:
{
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'court' | 'meeting' | 'deadline' | 'other';
}
Response:
{
  event: CalendarEvent;
}

PUT /api/calendar/events/:id
Request:
{
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  type?: string;
}
Response:
{
  event: CalendarEvent;
}

DELETE /api/calendar/events/:id
Response:
{
  success: boolean;
}
```

## Types

```typescript
interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data?: {
    name?: string;
    avatar_url?: string;
  };
  settings?: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

interface Incident {
  id: string;
  user_id: string;
  type: string;
  description: string;
  occurred_at: string;
  location?: string;
  sensitivity_level: 'high' | 'medium' | 'low';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'court' | 'meeting' | 'deadline' | 'other';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

## Error Handling

All endpoints return errors in the following format:

```typescript
{
  error: {
    message: string;
    code?: string;
    details?: unknown;
  }
}
```

Common error codes:
- `auth/invalid-credentials`: Invalid email or password
- `auth/email-already-exists`: Email already registered
- `validation/invalid-input`: Invalid request data
- `not-found`: Resource not found
- `forbidden`: Insufficient permissions
- `rate-limit`: Too many requests