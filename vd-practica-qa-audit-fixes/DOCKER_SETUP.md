# Docker Setup Guide - VD-Practica

This guide explains how to run VD-Practica using Docker with PostgreSQL and PgAdmin.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Node.js 18+ (for running the app locally without Docker)

## Quick Start

### 1. Start Docker Services

```bash
# From the project root directory
docker-compose up -d
```

This will:
- Start PostgreSQL on `localhost:5432`
- Start PgAdmin on `localhost:5050`
- Create a database called `vd_practica`

### 2. Verify Services Are Running

```bash
# Check container status
docker-compose ps

# Check PostgreSQL is healthy
docker-compose logs postgres
```

### 3. Access PgAdmin

1. Open your browser and go to: **http://localhost:5050**
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin`
3. Add Server connection:
   - Hostname/Address: `postgres` (or `localhost` if running on same machine)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `vd_practica`

### 4. Setup Environment

```bash
# Copy Docker environment example
cp .env.docker .env.local

# Or use your custom environment with Docker database URL
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vd_practica"
```

### 5. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 6. Run Database Migrations

```bash
npx prisma migrate dev
```

### 7. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Your app will be available at: **http://localhost:3000**

## Database Management

### View Database with PgAdmin
- URL: http://localhost:5050
- Email: `admin@example.com`
- Password: `admin`

### Using Prisma Studio

```bash
npx prisma studio
```

This opens a visual database editor at http://localhost:5555

## Stopping Services

```bash
# Stop all containers
docker-compose stop

# Stop and remove containers (data persists in volumes)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## Troubleshooting

### PostgreSQL Connection Refused
```bash
# Check if postgres container is running
docker-compose ps postgres

# Restart postgres
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### PgAdmin Not Accessible
- Make sure port 5050 is not in use: `lsof -i :5050`
- Restart pgadmin: `docker-compose restart pgadmin`

### Database Connection Issues
Ensure `.env.local` has:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vd_practica"
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

## Environment Variables

See `.env.example` for all available configuration options.

For Docker setup, use `.env.docker` as a base:
```bash
cp .env.docker .env.local
```

## Volumes

- **postgres_data**: Stores PostgreSQL database files
- **pgadmin_data**: Stores PgAdmin configuration

These persist even when containers are stopped.

## Network

Both services communicate over the `vd-practica-network` bridge network. The app running on your host machine connects via `localhost:5432`.

## Production Notes

For production deployment:
1. Use strong passwords for PostgreSQL and PgAdmin
2. Don't expose ports directly; use a reverse proxy (NGINX)
3. Use environment-specific `.env` files
4. Implement automated backups of `postgres_data` volume
5. Enable SSL for database connections
6. Use managed database services (AWS RDS, Supabase, Neon) instead of Docker containers
