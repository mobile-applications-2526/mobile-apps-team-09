# Quick Start Guide

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd mobile-apps-team-09
```

### 2. Install Frontend Dependencies

```bash
cd front-end
npm install
```

### 3. Start the Application

```bash
npm start
```

## Testing

### Component Tests

Run component tests from the frontend directory:

```bash
cd front-end
npm test
```

### E2E Tests (Detox)

First, generate iOS native files (only needed once):

```bash
cd front-end
npx expo prebuild
```

Build the app (needed once or after code changes):

```bash
npm run test:e2e:ios:build
```

Then run the tests:

```bash
npm run test:e2e:ios
```
