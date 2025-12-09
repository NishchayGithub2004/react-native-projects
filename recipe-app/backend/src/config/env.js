import "dotenv/config"; // load environment variables from a .env file into process.env at runtime so they can be accessed throughout the app

export const ENV = { // export an object that centralizes all environment variable lookups for consistent access across the project
    PORT: process.env.PORT || 5001, // read the PORT variable from environment and fall back to 5001 if undefined to ensure server has a valid listening port
    DATABASE_URL: process.env.DATABASE_URL, // read the database connection string from environment so the app can connect to the correct database
    NODE_ENV: process.env.NODE_ENV, // read the runtime environment type (e.g., development, production) so app behavior can adapt accordingly
};