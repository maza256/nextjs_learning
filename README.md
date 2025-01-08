## Next.js Development

Building on the Next.js tutorial, this project is now enhanced with RBAC (Role-Based Access Control). To demonstrate, the dashboard now only shows certain links to the user if they are not an admin, but all links, including dashboard, are protexted from users that are not logged in.

This also now has the database schema being built using drizzle, so that management of the database is in migrations.

### Getting Started

To get started, clone the repository and run `npm install` to install the dependencies. 

Update the `.env.example` file with the appropriate values for the database connection, renaming the file to `.env`

To configure the database, the file `scripts/database_creation.ts` can be run to create a table in the database. Then migrations can be carried out using the `drizzle-kit` commands of generate and migrate:

```aiignore
npx drizzle-kit generate
npx drizzle-kit migrate
```

Then, run `npm run dev` to start the development server.

