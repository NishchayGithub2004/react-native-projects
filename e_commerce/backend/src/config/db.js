import mongoose from "mongoose"; // import mongoose package to work with mongodb
import { ENV } from "./env.js"; // import ENV object from env.js file to load URL of mongoDB database using environment variable

export const connectDB = async () => { // create an async function to connect to desired mongodb database
    try {
        mongoose.connect(ENV.DB_URL); // connect to desired mongodb database using 'connect' method with URL of database provided via environment variable
        console.log(`Connected to MongoDB`); // log success message if connection is successful
    } catch (error) { // if any error occurs during connection
        console.error("MongoDB connection error: ", error); // log an error message with details of error to know what error occurred
        process.exit(1); // exit the process with exit code 1 to indicate that an error occurred
    }
};