import { requireAuth } from "@clerk/express"; // import 'requireAuth' middleware to create protected routes only users authenticated via Clerk can access
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js"; // import ENV object from env.js file to load sender's email address using environment variables

export const protectRoute = [ // define and export an array of middlewares to protect routes
    requireAuth(), // first middleware is requireAuth middleware to ensure user is authenticated via Clerk
    
    async (req, res, next) => { // define a custom middleware that takes user request object, server response object, and 'next' which is a function or
        // middleware that will be called after this middleware is executed
        try {
            // extract user ID from request object's 'auth' function, if it doesn't exist, return a 401 response with a message that user is unauthorized
            const clerkId = req.auth().userId;
            if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

            // find the user in database by the ID that came from user request object, if user doesn't exist, return a 404 response with a message that user is not found
            const user = await User.findOne({ clerkId });
            if (!user) return res.status(404).json({ message: "User not found" });

            req.user = user; // attach the data extracted from database to the request object to be used in subsequent middleware or route handlers

            next(); // pass control to the next middleware or route handler using 'next' function
        } catch (error) { // if any error occurs during execution of this middleware, log an error message and return a 500 response with a message that internal server error occurred
            console.error("Error in protectRoute middleware", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

export const adminOnly = (req, res, next) => { // create a middleware named 'adminOnly' to give access of routes to only admin and not normal app users 
    // this middleware takes user request object, server response object, and 'next' which is function/middleware after this middleware as parameters
    if (!req.user) return res.status(401).json({ message: "Unauthorized - user not found" }); // if user is not found in request object, return a 401 response with a message that user is unauthorized
    
    if (req.user.email !== ENV.ADMIN_EMAIL) return res.status(403).json({ message: "Forbidden - admin access only" }); // if user's email is not the same as admin email
    
    next(); // pass control to the next middleware or route handler in line using 'next' function
};