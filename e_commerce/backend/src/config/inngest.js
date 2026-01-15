import { Inngest } from "inngest"; // import 'Inngest' to define and run webhook events ie events that execute automatically when an action occurs
import { connectDB } from "./db.js"; // import 'connectDB' function to connect to the database
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "ecommerce-app" }); // create and export an instance of 'Inngest' class and uniquely identify it with name
// 'ecommerce-app' to manage all webhook events and functions related to this instance specifically

const syncUser = inngest.createFunction( // create an inngest function named 'syncUser'
    { id: "sync-user" }, // create a unique identifier for the function named 'sync-user'
    { event: "clerk/user.created" }, // specify that this function triggers when a new user account is created using Clerk
    
    async ({ event }) => { // define the working of this function, it takes an event object as argument
        await connectDB(); // connect to the database using 'connectDB' function
        
        const { id, email_addresses, first_name, last_name, image_url } = event.data; // from the event object's data, extract the following properties of user:
        // unique identifier, array of email addresses, first name, last name, and profile picture URL

        const newUser = { // create an object named 'newUser' to store new user's details in appropriate properties
            clerkId: id, // 'clerkId' property stores the unique identifier of the user
            email: email_addresses[0]?.email_address, // 'email' property stores the first email address of the user ('?' means optional chaining ie
            // if email_addresses array is empty or undefined, it returns undefined instead of throwing an error)
            name: `${first_name || ""} ${last_name || ""}` || "User", // 'name' property stores the full name of the user, created by merging first and last name
            // if either are missing, they become empty string, if both are missing, value of 'name' is set to 'User'
            imageUrl: image_url, // 'imageUrl' property stores the URL of the user's profile picture
            addresses: [], // 'addresses' property is an empty array to store user's shipping addresses since user has just created an account
            wishlist: [], // 'wishlist' property is an empty array to store user's wishlist items since user has just created an account
        };

        await User.create(newUser); // insert 'newUser' object to 'User' collection
    }
);

const deleteUserFromDB = inngest.createFunction( // create an inngest function named 'deleteUserFromDB'
    { id: "delete-user-from-db" }, // create a unique identifier for the function named 'delete-user-from-db'
    { event: "clerk/user.deleted" }, // specify that this function triggers when a user account is deleted
    
    async ({ event }) => { // define the working of this function, it takes an event object as argument
        await connectDB(); // connect to the database using 'connectDB' function
        const { id } = event.data; // extract the unique identifier of the user from the event object's data
        await User.deleteOne({ clerkId: id }); // delete the document from 'User' collection where 'clerkId' property matches the extracted 'id'
        // this deletes the user's record from the database
    }
);

export const functions = [syncUser, deleteUserFromDB]; // export both functions to be used in other parts of the application