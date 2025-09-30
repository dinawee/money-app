# Assignment

## Key Technical Decisions

### 1. State Management Architecture

- Svelte 5 Runes with class-based state management
- Modern Svelte patterns using `$state`, `$derived`
- Encapsulation with dependency injection for testability
- Clear separation between business logic (classes) and UI (components)

### 2. Component Architecture Pattern

- Container-View separation

### 3. Form Validation Approach

- Client-side: Immediate feedback (required fields, format validation)
- Server-side: Business rules (duplicate accounts, insufficient funds)
- Real-time validation: Error clearing on user input

### 4. Error Handling Strategy

- Typed error classes with centralized state

### 5. Testing Methodology

- Browser and Unit Tests

### 6. User Experience

- Accessibility with ARIA labels

### 7. Maintainability

- Dependency Injection: Easy mocking and testing
- Clean abstraction layers
- TypeScript: Compile-time safety throughout

### 8. Scalability

- Reusability: Forms can be used in different contexts
- Centralization: Single source of truth for account data
- Modular Design: Features can be developed independently

## Assumptions

### Business Requirements

1. All transactions in one currency (no conversion)
2. API endpoints don't require authentication
3. Server always available during development
4. Primary target is desktop browsers
5. No API endpoint to retrieve existing accounts - app starts with empty state on each reload

### Data Handling

1. Backend is source of truth for all balance calculations
2. Account IDs are unique positive integers
3. Account data exists only during current browser session - no persistence API available
