# Science Olympiad Management System

A user management system for the Waugh School Science Olympiad program. The application provides authentication, role-based access, event management, event scoring, volunteer-hour tracking, and administrative review workflows.

## Architecture

The repository contains two applications:

- `frontend/`: React, TypeScript, Vite, React Router, and Tailwind CSS
- `backend/`: Node.js, Express, MongoDB/Mongoose, JWT authentication, and Nodemailer

The frontend and backend are deployed separately. The frontend calls the backend through `VITE_API_URL`. The backend connects to MongoDB through `DATABASE_URI`.

```text
Browser
	|
	v
Vercel frontend  --->  Express API  --->  MongoDB Atlas
												 |
												 v
											 Email provider
```

## Repository structure

```text
.
├── .github/workflows/ci.yml     # GitHub Actions CI
├── backend/                     # Express API
│   ├── config/                  # Database and role configuration
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Authentication, approval, and role checks
│   ├── models/                 # Mongoose models
│   └── routes/                 # API route definitions
├── frontend/                   # React application
│   ├── src/api/                # API client
│   ├── src/components/         # Shared UI components
│   ├── src/contexts/            # Authentication context
│   ├── src/pages/               # Application pages
│   ├── tests/                  # Playwright browser tests
│   └── playwright.config.ts    # Playwright configuration
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB for local backend development
- Google Chrome, Microsoft Edge, or Playwright browsers for local browser tests

## Main application areas

Public routes:

- `/login`: sign in
- `/register`: create an account
- `/forgot-password`: request a password-reset email

Protected routes:

- `/dashboard`: event and review summary
- `/events`: list available events
- `/events/:eventId`: event details
- `/admin/review`: review event-score submissions for admins and volunteers

API route groups:

- `/auth`: signup, login, refresh, password reset, and user administration
- `/events`: event listing, creation, updates, deletion, and RSVPs
- `/event-scores`: score submission and review
- `/volunteer-hours`: volunteer-hour operations

Role and approval checks are enforced by the backend. Frontend route guards improve the user experience but are not a replacement for backend authorization.

## Testing

The project currently uses Playwright as the browser testing tool. The tests mock API responses so they are deterministic and do not require production credentials, email delivery, or a database.

From `frontend/`:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:e2e
```

The suite covers:

- Login, registration, invalid login, and password-reset request screens
- Redirecting unauthenticated users from protected pages
- Authenticated dashboard access, refresh persistence, and logout
- Blocking regular users from admin review
- Allowing admins to open the review queue
- Event listing, event details, and empty event states

On macOS, the local Playwright configuration uses an installed Google Chrome browser. GitHub Actions installs its own Chromium browser on Ubuntu.

The frontend build runs TypeScript validation and creates the Vite production bundle:

```bash
npm run build
```

## CI/CD

GitHub Actions is defined in `.github/workflows/ci.yml`. It runs on pull requests and pushes to `main` and performs:

1. Installs Node.js 20
2. Installs frontend dependencies with `npm ci`
3. Installs Playwright Chromium and its Ubuntu dependencies
4. Runs `npm run build`
5. Runs `npm run test:e2e`

The workflow is CI. It verifies changes but does not deploy the application.

Recommended deployment flow:

```text
Feature branch
		|
		v
Pull request -> GitHub Actions build and Playwright tests
		|
		v
Merge to main
		|
		+--> Vercel deploys the frontend
		+--> Backend host deploys the Express API
```

Vercel can deploy the `frontend/` directory and should define `VITE_API_URL` in its project environment settings. The backend should be deployed separately to a Node-compatible host such as Render, Railway, Fly.io, or a VPS. Define the backend environment variables in that host's secret settings.

Docker is not required for the current deployment model. It becomes useful if the backend is self-hosted, deployed to a container platform, or needs identical containerized environments across development, staging, and production.

## Security and production notes

- Never commit `backend/.env`, frontend environment files, passwords, tokens, or API keys.
- Use different secrets and databases for local, staging, and production environments.
- Use a strong, unique `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` in production.
- Set `FRONTEND_URL` to the exact HTTPS frontend origin in production.
- Use MongoDB Atlas or another managed MongoDB service with backups and restricted access.
- Keep the backend authorization checks enabled; client-side guards can be bypassed by a malicious client.
- Use HTTPS for both frontend and backend so authentication cookies and tokens are protected in transit.
- Add monitoring, error tracking, and uptime checks before opening the application to a wider user group.
