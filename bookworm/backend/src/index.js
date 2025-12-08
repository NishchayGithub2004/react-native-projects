import express from "express"; // import express to create and configure the HTTP server
import cors from "cors"; // import cors to enable controlled cross-origin requests for frontend access
import "dotenv/config"; // load environment variables so configuration values become available at runtime
import authRoutes from "./routes/authRoutes.js"; // import authentication-related route handlers to attach under a dedicated path
import bookRoutes from "./routes/bookRoutes.js"; // import book-related route handlers to provide CRUD operations for books
import { connectDB } from "./lib/db.js"; // import database connection function to establish a persistent DB connection on server start

const app = express(); // create express application instance to register middleware and route handlers
const PORT = process.env.PORT || 3000; // determine server port from environment or use fallback to ensure server starts consistently

app.use(express.json()); // register middleware to parse incoming JSON bodies so routes can access request payloads
app.use(cors()); // enable CORS to allow requests from browsers hosted on different origins

app.use("/api/auth", authRoutes); // mount authentication routes under /api/auth to separate auth logic from other routes
app.use("/api/books", bookRoutes); // mount book routes under /api/books to organize book operations under a dedicated URL prefix

app.listen(PORT, () => { // start the HTTP server on the configured port so the API becomes accessible to clients
    console.log(`Server running on port ${PORT}`); // log startup message to confirm server status for debugging and monitoring
    connectDB(); // initiate database connection during server startup to ensure DB availability before transaction handling
});