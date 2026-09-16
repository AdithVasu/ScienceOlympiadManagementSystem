# ScienceOlympiadManagementSystem
A user management system for the Waugh School science olympiad to help streamline operations

## Frontend testing

From the `frontend` directory:

```bash
npm install
npm run build
npm run test:e2e
```

The Playwright suite uses mocked API responses for deterministic browser tests. It does not require production credentials or a database. GitHub Actions runs the build and Playwright tests on pull requests and pushes to `main`.
