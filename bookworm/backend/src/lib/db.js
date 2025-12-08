import mongoose from "mongoose"; // import mongoose library to manage mongodb connections and schema operations

export const connectDB = async () => { // define an async function 'connectDB' to establish a mongodb connection
    try { // begin error-handling block to attempt a safe connection
        const conn = await mongoose.connect(process.env.MONGO_URI); // connect to mongodb using the URI from environment variables and store the connection object
        console.log(`Database connected ${conn.connection.host}`); // log the host of the active mongodb connection for verification
    } catch (error) { // catch any failure that occurs during the connection attempt
        console.log("Error connecting to database", error); // log the connection failure along with the specific error for debugging
        process.exit(1); // terminate the process with a non-zero exit code to indicate a critical startup failure
    }
};