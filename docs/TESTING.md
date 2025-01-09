# Testing Guide

## Overview

Aurora uses a comprehensive testing strategy to ensure reliability and security.

## Test Types

### 1. Unit Tests

```typescript
// Example component test
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

```typescript
// Example integration test
describe('IncidentForm', () => {
  it('submits incident data', async () => {
    const onSubmit = jest.fn();
    render(<IncidentForm onSubmit={onSubmit} />);
    
    // Fill form
    await userEvent.type(
      screen.getByLabelText('Description'),
      'Test incident'
    );
    
    // Submit form
    await userEvent.click(screen.getByText('Submit'));
    
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### 3. E2E Tests

```typescript
// Example E2E test
describe('Authentication', () => {
  it('allows user to log in', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Running Tests

1. Unit Tests:
   ```bash
   npm run test:unit
   ```

2. Integration Tests:
   ```bash
   npm run test:integration
   ```

3. E2E Tests:
   ```bash
   npm run test:e2e
   ```

## Test Coverage

Aim for:
- Unit Tests: 80%+ coverage
- Integration Tests: 70%+ coverage
- E2E Tests: Critical paths covered

## Security Testing

1. Authentication Tests
2. Authorization Tests
3. Input Validation Tests
4. API Security Tests

## Performance Testing

1. Load Tests
2. Stress Tests
3. Endurance Tests

## Writing Tests

### Best Practices

1. Follow AAA pattern:
   ```typescript
   describe('Component', () => {
     it('does something', () => {
       // Arrange
       const props = { ... };
       
       // Act
       render(<Component {...props} />);
       
       // Assert
       expect(...).toBe(...);
     });
   });
   ```

2. Use meaningful descriptions:
   ```typescript
   describe('IncidentForm', () => {
     describe('validation', () => {
       it('requires description field', () => {
         // Test
       });
     });
   });
   ```

3. Test edge cases:
   ```typescript
   describe('NumberInput', () => {
     it('handles negative numbers', () => {
       // Test
     });
     
     it('handles decimal points', () => {
       // Test
     });
   });
   ```

## Continuous Integration

1. Pre-commit hooks:
   ```bash
   npm run pre-commit
   ```

2. CI pipeline:
   ```yaml
   steps:
     - run: npm install
     - run: npm run lint
     - run: npm run test
     - run: npm run build
   ```

## Test Environment

1. Setup:
   ```bash
   npm run test:setup
   ```

2. Teardown:
   ```bash
   npm run test:teardown
   ```

## Mocking

1. API Mocks:
   ```typescript
   jest.mock('@/lib/api', () => ({
     getIncidents: jest.fn()
   }));
   ```

2. Component Mocks:
   ```typescript
   jest.mock('@/components/Button', () => ({
     Button: ({ children }) => <button>{children}</button>
   }));
   ```

## Debugging Tests

1. Debug mode:
   ```bash
   npm run test:debug
   ```

2. Test logging:
   ```typescript
   test('debug example', () => {
     console.log('Debug info');
     expect(true).toBe(true);
   });
   ```