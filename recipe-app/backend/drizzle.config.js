import { ENV } from "./src/config/env.js"; // import environment variables so the migration config can access the database connection string

export default { // export the drizzle migration configuration object used by CLI tools
    schema: "./src/db/schema.js", // specify the path to the database schema so migrations can be generated from defined tables
    out: "./src/db/migrations", // define the output directory where migration files will be stored
    dialect: "postgresql", // declare the SQL dialect so drizzle knows how to generate dialect-specific migration SQL
    dbCredentials: { url: ENV.DATABASE_URL }, // provide database connection credentials using the environment-defined URL so migrations run against the correct database
};