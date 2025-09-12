# Testing Setup and Instructions for Fitness Tracker App

## 1. Setting up Testing Framework

To add automated testing to this React + TypeScript project, follow these steps:

### Install dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest ts-jest
```

### Configure Jest

Create a `jest.config.js` file in the project root with:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

### Setup Testing Library

Create `jest.setup.ts` file with:

```ts
import '@testing-library/jest-dom';
```

### Add test script to `package.json`

```json
"scripts": {
  "test": "jest --watchAll"
}
```

## 2. Writing Tests

- Write unit tests for key components:
  - `AIChatbot.tsx`: test rendering, user input, and bot response generation.
  - `Dashboard.tsx`: test data fetching and rendering of stats cards, charts, and lists.
  - `Leaderboard.tsx`: test leaderboard fetching, sorting, and rendering.
  - `StepTracker.tsx`: test step display, manual step addition, and progress bar.
  - `WaterTracker.tsx`: test water intake display, adding intake, and progress bar.

- Write integration tests for backend API routes and fitnessIntegration.ts functions.

## 3. Manual Testing Instructions

If you prefer manual testing or want to verify functionality before automated tests:

- Run the app locally (`npm run dev`).
- Verify the following flows:
  - User login and authentication.
  - Dashboard loads with correct stats and charts.
  - Leaderboard updates and filters by timeframe.
  - Step tracker shows current steps, allows manual addition.
  - Water tracker shows intake, allows adding new entries.
  - AI Chatbot responds appropriately to fitness queries.
  - Backend fitness integration endpoints work as expected.

## 4. Next Steps

Please confirm which parts you want me to help implement first:
- Setup automated testing framework and write tests.
- Provide detailed manual testing steps.
- Both automated and manual testing.
- Skip testing and proceed to task completion.
