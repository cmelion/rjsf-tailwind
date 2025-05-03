<br />
<p align="center">
  <h3 align="center">@rjsf/tailwind</h3>

  <p align="center">
  Tailwind theme, fields and widgets for <a href="https://github.com/mozilla-services/react-jsonschema-form/"><code>react-jsonschema-form</code></a>.
    <br />
    <a href="https://rjsf-team.github.io/react-jsonschema-form/docs/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://cmelion.github.io/rjsf-tailwind/">View @rjsf/tailwind Playground</a>
    ·
    <a href="https://cmelion.github.io/rjsf-tailwind/storybook/">View @rjsf/tailwind Storybook</a>
    ·
    <a href="https://cmelion.github.io/rjsf-tailwind/coverage/">View @rjsf/tailwind Coverage Report</a>
    ·
    <a href="https://cmelion.github.io/rjsf-tailwind/bdd-reports/">View @rjsf/tailwind Playwright Test Report</a>
    <br />
    <a href="https://rjsf-team.github.io/react-jsonschema-form/">View @rjsf Playground</a>
    <br/><br/>
    <a href="https://www.linkedin.com/search/results/all/?keywords=%23ModernBDDTesting"><strong>#ModernBDDTesting</strong></a>
  </p>

## Quick Start

### To install

```bash
yarn
```

### Run in development mode

```bash
yarn dev
```

### Run in Storybook mode

```bash
yarn storybook
```


## ✨ Features

*   **RJSF Tailwind Theme:** Provides Tailwind-styled components for `react-jsonschema-form`.
*   **Modern Frontend Stack:** Built with React, TypeScript, and Vite for a fast development experience.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development. Includes class sorting, merging, and linting.
*   **Component Development:** Storybook for isolated component development, testing, and documentation.
*   **State Management:** Zustand for simple global state management.
*   **Comprehensive Testing:**
    *   **BDD/E2E Tests:** Playwright with `playwright-bdd` and QuickPickle (`.feature` files) for behavior-driven development testing.
    *   **Component Tests:** Vitest and React Testing Library for unit and integration testing of components.
    *   **Storybook Interaction Tests:** Verify component interactions directly within Storybook.
*   **API Mocking:** MSW (Mock Service Worker) for mocking API requests during development and testing.
*   **CI/CD:** GitHub Actions workflow for automated building, testing (component and BDD), and deployment to GitHub Pages.
*   **Dark Mode:** Support for dark color schemes.
*   **Code Quality:** ESLint and Prettier configured for consistent code style and quality.
*   **100% Customizable:** Easily extendable and configurable.

## 🚀 Tech Stack

*   **Framework:** React 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** Radix UI Primitives, Lucide Icons
*   **Form Generation:** `react-jsonschema-form` (RJSF)
*   **State Management:** Zustand
*   **Component Development:** Storybook
*   **BDD/E2E Testing:** Playwright, Playwright-BDD, QuickPickle
*   **Component Testing:** Vitest, React Testing Library
*   **API Mocking:** MSW
*   **Package Manager:** Yarn v1

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   Yarn v1

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <repo-name>
yarn install
```
## 🛠️ Available Scripts

*   **`yarn dev`**: Starts the Vite development server for the main application.
*   **`yarn build`**: Builds the application for production.
*   **`yarn preview`**: Serves the production build locally.
*   **`yarn storybook`**: Starts the Storybook development server.
*   **`yarn build-storybook`**: Builds Storybook for deployment.
*   **`yarn test:bdd`**: Runs Playwright BDD tests (generates steps first).
*   **`yarn test:bdd:ci`**: Runs Playwright BDD tests in CI mode (starts Storybook server first).
*   **`yarn test:bdd:ui`**: Opens the Playwright UI mode for debugging BDD tests.
*   **`yarn test:components`**: Runs Vitest component tests.
*   **`yarn test:components:coverage`**: Runs Vitest component tests and generates a coverage report.
*   **`yarn lint`**: Lints the codebase using ESLint.

##🧪 Testing Strategy

This project employs a multi-layered testing approach:

1.  **Component Tests (Vitest):** Located alongside components (e.g., `*.test.tsx`), these tests use Vitest and React Testing Library to verify individual component logic and rendering in isolation. Run with `yarn test:components`. Coverage reports are generated via `yarn test:components:coverage`.
2.  **BDD/E2E Tests (Playwright/QuickPickle):** Feature files (`*.feature`) define application behavior in Gherkin syntax. Step definitions (`*.steps.ts` or `*.steps.tsx`) implement these behaviors using Playwright to interact with the browser (often against Storybook stories or the main app). Run with `yarn test:bdd`. These tests ensure features work correctly from a user's perspective. BDD test reports are generated automatically during the CI process.
3.  **Storybook Interaction Tests:** Storybook's `play` functions are used within stories (`*.stories.tsx`) to simulate user interactions and assert component states directly within the Storybook environment.

## ⚙️ CI/CD

A GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) automates the following on pushes to the `main` branch:

1.  **Checkout Code:** Fetches the latest code.
2.  **Setup Node.js & Yarn:** Configures the environment and installs dependencies.
3.  **Install Playwright Browsers:** Ensures necessary browser binaries are available.
4.  **Build App:** Creates a production build of the Vite application.
5.  **Run Component Tests:** Executes Vitest tests and collects coverage.
6.  **Run BDD Tests:** Starts the Storybook server (`storybook:ci`) and runs Playwright BDD tests against it.
7.  **Build Storybook:** Creates a static build of the Storybook documentation site.
8.  **Deploy to GitHub Pages:** Uploads the application build (`dist/`), Storybook build (`dist/storybook/`), component coverage report (`dist/coverage/`), and BDD test report (`dist/bdd-reports/`) as artifacts and deploys them to GitHub Pages.

The deployed sites and reports can be accessed via the links at the top of this README.
