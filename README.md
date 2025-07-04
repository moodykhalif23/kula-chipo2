# Database Setup and Configuration

This project uses PostgreSQL as the primary database, managed via Docker and Prisma ORM. Follow these steps to set up and configure the database for local development and production environments.

## 1. PostgreSQL with Docker

A `docker-compose.yml` file is provided to simplify running PostgreSQL locally. The default configuration is as follows:

- **Image:** postgres:15
- **User:** kulachipo
- **Password:** kulachipo_pass
- **Database:** kulachipo_db
- **Port:** 5432

To start the database, run:

```
docker compose up -d
```

This will start a PostgreSQL instance accessible at `localhost:5432`.

## 2. Prisma ORM Setup

Prisma is used for database schema management and type-safe database access.

- The Prisma schema is defined in `prisma/schema.prisma`.
- The database connection string is managed via the `DATABASE_URL` environment variable.

### Environment Variable

Create a `.env` file in the project root with the following content:

```
DATABASE_URL="postgresql://kulachipo:kulachipo_pass@localhost:5432/kulachipo_db"
```

### Initialize and Migrate the Database

After starting the PostgreSQL container and setting the environment variable, run:

```
npx prisma migrate dev --name init
```

This command will apply the schema and create the necessary tables in the database.

### Prisma Client

The Prisma Client is generated automatically after each migration. You can use it in your application to interact with the database.

## 3. Seeding the Database

A seed script is provided to populate the database with sample data for development and testing. To run the seed script:

```
pnpm run prisma:seed
```

This will create sample users, a vendor, menu items, and a review.

## 4. Database Management Tools

You can use any PostgreSQL client to inspect and manage your database. Recommended tools include:

- [pgAdmin](https://www.pgadmin.org/)
- [TablePlus](https://tableplus.com/)
- [DBeaver](https://dbeaver.io/)

Connect using the following credentials:

- **Host:** localhost
- **Port:** 5432
- **User:** kulachipo
- **Password:** kulachipo_pass
- **Database:** kulachipo_db

## 5. Prisma Schema Overview

The schema includes the following models:

- **User**: Application users (customers and vendors)
- **Vendor**: Vendor profiles (extends User)
- **MenuItem**: Menu items for each vendor
- **Review**: Customer reviews for vendors
- **Reservation**: Reservations/bookings for vendors

Refer to `prisma/schema.prisma` for full details.

## 6. Troubleshooting

- Ensure Docker is running and the PostgreSQL container is healthy.
- Verify the `DATABASE_URL` in your `.env` file matches the Docker configuration.
- If you change the schema, run `npx prisma migrate dev` to apply updates.
- For issues with Prisma Client, regenerate it with `npx prisma generate`.

## 7. Production Considerations

- Use strong, unique credentials for production databases.
- Configure SSL and backups for production PostgreSQL instances.
- Review and restrict database access as appropriate for your deployment environment. 