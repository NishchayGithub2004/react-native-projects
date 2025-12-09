import express from "express"; // import express to create an HTTP server and define REST API routes
import { ENV } from "./config/env.js"; // import ENV object to access environment variables like server port
import { db } from "./config/db.js"; // import drizzle ORM instance to execute typed database operations
import { favoritesTable } from "./db/schema.js"; // import the favorites table schema so ORM queries know table structure
import { and, eq } from "drizzle-orm"; // import logical operators 'and' and comparison operator 'eq' to build SQL conditions

const app = express(); // create an express application instance to handle incoming HTTP requests

const PORT = ENV.PORT || 5001; // determine the server port by reading from environment and fallback to 5001 if undefined

app.use(express.json()); // register express JSON parser middleware so request bodies are automatically parsed into JS objects

app.get("/api/health", (_, res) => { // define a GET route for health checks to verify the server is operational
    res.status(200).json({ success: true }); // send a 200 response with a simple JSON payload indicating service availability
});

app.post("/api/favorites", async (req, res) => { // define a POST route to add a favorite recipe entry for a user
    try { // start error-handling block to catch any runtime issues during database operations
        const { userId, recipeId, title, image, cookTime, servings } = req.body; // extract required and optional fields from incoming request body for insertion

        if (!userId || !recipeId || !title) return res.status(400).json({ error: "Missing required fields" }); // validate required fields and return a 400 response if missing

        const newFavorite = await db // execute insertion query through drizzle ORM to add a new favorite
            .insert(favoritesTable) // specify the table into which data will be inserted
            .values({ userId, recipeId, title, image, cookTime, servings }) // define column values provided by the client request
            .returning(); // request the inserted record back from the database for confirmation

        res.status(201).json(newFavorite[0]); // return the newly created record with 201 status indicating resource creation
    } catch (error) { // catch any failure during insert process
        console.log("Error adding favorite", error); // log error details for debugging
        res.status(500).json({ error: "Something went wrong" }); // return generic 500 error response to client
    }
});

app.get("/api/favorites/:userId", async (req, res) => { // define a GET route to fetch all favorite recipes for a specific user
    try { // start guarded execution for db query
        const { userId } = req.params; // extract userId from route parameters to identify target user

        const userFavorites = await db // perform a selection query to fetch user's saved favorites
            .select() // select all columns from the table
            .from(favoritesTable) // specify table to fetch from
            .where(eq(favoritesTable.userId, userId)); // filter rows where userId matches the provided parameter

        res.status(200).json(userFavorites); // return the retrieved list of favorites with 200 status code
    } catch (error) { // capture unexpected issues
        console.log("Error fetching the favorites", error); // log debugging information
        res.status(500).json({ error: "Something went wrong" }); // return fallback internal server error
    }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => { // define a DELETE route to remove a specific favorite entry for a user
    try { // initiate protected execution block
        const { userId, recipeId } = req.params; // extract parameters to identify the exact record to delete

        await db // execute a deletion operation against the database
            .delete(favoritesTable) // specify table to delete from
            .where( // provide deletion condition
                and( // combine multiple conditions to identify unique entry
                    eq(favoritesTable.userId, userId), // ensure row's userId matches route parameter
                    eq(favoritesTable.recipeId, parseInt(recipeId)) // ensure row's recipeId matches parameter, converting it to number
                )
            );

        res.status(200).json({ message: "Favorite removed successfully" }); // return success acknowledgment after deletion
    } catch (error) { // handle operational exceptions
        console.log("Error removing a favorite", error); // log error for server-side inspection
        res.status(500).json({ error: "Something went wrong" }); // return failure response
    }
});

app.listen(PORT, () => { // instruct express server to begin listening for incoming requests on specified port
    console.log("Server is running on PORT:", PORT); // log a message confirming active server and listening port
});