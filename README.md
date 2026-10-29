# HRMS

Human Resource Management System with an Express/TypeScript API and a Next.js web application.

## Project structure

```text
.
├── HRMS-Server/    Express API, authentication, and MongoDB models
├── HRMS-Ui/        Next.js frontend
├── package.json    Root scripts and npm workspaces
└── pnpm-workspace.yaml
```

The backend currently provides authentication, role and permission management, departments, department assignments, assets and asset assignments, holidays, and a health endpoint. The frontend is a Next.js app.

## Prerequisites

- Node.js 20.9 or newer
- npm 10+ or pnpm 10+
- MongoDB, locally or through MongoDB Atlas

## Install

Run one of these commands from the repository root to install dependencies for both apps:

```bash
npm install
```

Or:

```bash
pnpm install
```

Do not install dependencies separately in the app folders; the root manifest and workspace configuration manage both projects.

## Configure the backend

Copy the example environment file:

```bash
cp HRMS-Server/.env.example HRMS-Server/.env
```

Set `MONGO_URI` to your MongoDB connection string and replace `BETTER_AUTH_SECRET` with a secure random secret of at least 32 characters. For local development, the example values use the API on port `5000` and the frontend on port `3000`.

| Variable | Purpose |
| --- | --- |
| `PORT` | Express API port (default: `5000`) |
| `NODE_ENV` | Node environment (default: `development`) |
| `PRODUCTION` | Explicit production-mode toggle |
| `ALLOW_ORIGIN` | Comma-separated CORS origins allowed to call the API |
| `MONGO_URI` | MongoDB connection string (required) |
| `BETTER_AUTH_SECRET` | Better Auth signing/encryption secret |
| `BETTER_AUTH_URL` | Public base URL of the API (default: `http://localhost:5000`) |
| `LOG_LEVEL` | Logging threshold (default: `info`) |

Keep `.env` files and secret values out of source control. The `.env.example` template is safe to commit.

## Run in development

Start both the API and frontend from the repository root:

```bash
npm run dev
```

Or:

```bash
pnpm run dev
```

The frontend is available at [http://localhost:3000](http://localhost:3000). The API listens at [http://localhost:5000](http://localhost:5000), and its health endpoint is [http://localhost:5000/api/health](http://localhost:5000/api/health).

Run an app by itself if needed:

```bash
npm run server  # API only
npm run client  # frontend only
```

## Build and production

Build both apps from the repository root:

```bash
npm run build
```

Or:

```bash
pnpm run build
```

After building and configuring the production environment, start both production servers:

```bash
npm run start
```

Or:

```bash
pnpm run start
```

The API is compiled to `HRMS-Server/dist`; the frontend is built by Next.js. The backend must be able to connect to MongoDB at startup. Deploy the API and frontend with the correct public URLs and CORS origins for your environment.

## Install a package in one app

From the root, use a workspace filter with pnpm:

```bash
pnpm --filter hrms-ui add react-icons
pnpm --filter hrms-server add <package-name>
```

Or change into the app directory and add the dependency there:

```bash
cd HRMS-Ui
pnpm add react-icons
```

Use `pnpm add` to add a package; `pnpm install` (or `pnpm i`) installs dependencies already listed in the manifest.

With npm, target a workspace by its package name:

```bash
npm install react-icons --workspace=hrms-ui
npm install <package-name> --workspace=hrms-server
```

## API overview

Application endpoints are mounted under `/api`:

| Endpoint | Description |
| --- | --- |
| `/api/health` | API health check |
| `/api/auth/*` | Better Auth endpoints |
| `/api/me` | Current authenticated user |
| `/api/roles` | Roles and permissions |
| `/api/assets` | Asset inventory |
| `/api/departments` | Departments |
| `/api/department-assign` | Department assignments |
| `/api/holidays` | Holiday calendar |
| `/api/shifts` | Shift management |

Most management endpoints require an authenticated user and the relevant permission. See the route files under `HRMS-Server/src/module/` for the individual operations and access requirements.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` / `pnpm run dev` | Run both apps in development mode |
| `npm run build` / `pnpm run build` | Build both apps |
| `npm run start` / `pnpm run start` | Run both production servers after building |
| `npm run server` | Run only the backend in development mode |
| `npm run client` | Run only the frontend in development mode |
