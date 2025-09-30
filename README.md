# Financial Account Transfer Frontend

A SvelteKit frontend application for managing financial accounts and transfers.

## Requirements

- Node.js LTS/Jod v22.20.0

## Setup

1. Install dependencies:

```sh
npm install
```

2. Start the development server:

```sh
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Usage

- **Create Account**: Add new financial accounts with initial balances
- **Transfer Money**: Move funds between accounts
- **View Dashboard**: See all accounts and total balance

## Testing

```sh
# Run all unit tests
npm run test:unit
```

```sh
# Run browser tests
npm run test:browser
```

```sh
# Run all tests
npm test
```

## Development

- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Architecture

- **Frontend**: SvelteKit with Skeleton UI
- **State Management**: Svelte 5 runes with context stores
- **Testing**: Vitest + Testing Library
- **Accessibility**: WCAG 2.1 AA compliant
