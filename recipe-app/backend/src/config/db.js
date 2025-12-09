import { drizzle } from "drizzle-orm/neon-http"; // import 'drizzle' to create a typesafe query builder/ORM instance that works with the neon HTTP driver
import { neon } from "@neondatabase/serverless"; // import 'neon' to create a serverless HTTP-based Postgres client connection
import { ENV } from "./env.js"; // import ENV object to access environment variables, including the database URL
import * as schema from "../db/schema.js"; // import all schema definitions so drizzle can map queries to typed table structures

const sql = neon(ENV.DATABASE_URL); // initialize a neon postgres client using the database URL from environment variables, enabling HTTP-based db access

export const db = drizzle(sql, { schema }); // create and export a drizzle ORM instance bound to neon client and database schema for typed queries