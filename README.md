# Team Task Manager

A full-stack web application for managing team projects and tasks, built with Next.js, Prisma, and SQLite (swappable to PostgreSQL).

## Features
- **Authentication**: Secure JWT-based login and signup.
- **Role-Based Access Control**: `ADMIN` and `MEMBER` roles.
- **Projects**: Create projects and assign team members.
- **Tasks**: Create, assign, and track tasks (To Do, In Progress, Review, Done).
- **Dashboard**: Real-time statistics and overdue task tracking.

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the environment**:
   Make sure the `.env` file exists with:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_secret_key"
   ```

3. **Initialize the database**:
   ```bash
   npx prisma migrate dev
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Railway)

This repository is pre-configured for deployment on [Railway](https://railway.app/).

### Quick Deploy (SQLite)
1. Push this repository to GitHub.
2. Go to Railway, click "New Project" -> "Deploy from GitHub repo".
3. Select this repository.
4. Add the `JWT_SECRET` environment variable in Railway.
5. Deploy! Railway will automatically use the `railway.json` configuration to run database migrations and start the server.
   *Note: Railway's free tier has ephemeral storage for SQLite. For persistent data, attach a persistent volume to the service, or switch to PostgreSQL.*

### Deploying with PostgreSQL (Recommended for Production)
1. In Railway, click "New" -> "Database" -> "Add PostgreSQL".
2. Link the PostgreSQL database to your Next.js service. Railway will automatically inject the `DATABASE_URL` environment variable.
3. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "sqlite" // Change this to "postgresql"
   }
   ```
4. Push the changes to GitHub. Railway will automatically apply migrations to the new PostgreSQL database.

## Demo Video
*(Please record your 2-5 minute demo video and link it here)*
