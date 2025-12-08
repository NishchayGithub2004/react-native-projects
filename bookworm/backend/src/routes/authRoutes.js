import express from "express"; // import express to create a router instance for defining authentication-related routes
import User from "../models/User.js"; // import the user model so routes can create or validate user records
import jwt from "jsonwebtoken"; // import jsonwebtoken to generate jwt tokens used for session management

const authRoutes = express.Router(); // create a new router object to group all authentication endpoints under a single module

const generateToken = (userId) => { // define a helper function to create a jwt token containing the user's id
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" }); // sign the token using the secret key and set its validity duration
};

authRoutes.post("/register", async (req, res, next) => { // define a post route for user registration to create new accounts
    try { // start a try block to catch validation or database errors
        const { email, username, password } = req.body; // extract registration fields from the request body for processing
        
        if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" }); // enforce mandatory input fields
        
        if (password.length < 6) return res.status(400).json({ message: "Password should be at least 6 characters long" }); // reject weak passwords
        
        if (username.length < 3) return res.status(400).json({ message: "Username should be at least 3 characters long" }); // enforce a minimum username length
        
        const existingEmail = await User.findOne({ email }); // search database for an existing user with the same email
        
        if (existingEmail) return res.status(400).json({ message: "Email already exists" }); // block registration if email is already taken
        
        const existingUsername = await User.findOne({ username }); // search database for an existing user with the same username
        
        if (existingUsername) return res.status(400).json({ message: "Username already exists" }); // block registration if username is already taken

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`; // generate a default avatar url based on the username for consistent styling

        const user = new User({ // create a new user instance with validated and prepared data
            email, // assign user email directly from the request body
            username, // assign username directly from the request body
            password, // assign raw password which will be hashed by the pre-save hook
            profileImage, // assign generated avatar to the user profile
        });

        await user.save(); // persist the newly created user into the database

        const token = generateToken(user._id); // generate a jwt token tied to the newly created user's identifier

        res.status(201).json({ // respond with a success status and return token plus publicly safe user fields
            token, // include authentication token so the client can initiate a session
            user: { // include essential user details in the response payload
                id: user._id, // expose user identifier for frontend usage
                username: user.username, // include username for profile display
                email: user.email, // include email for client reference
                profileImage: user.profileImage, // include profile image for UI rendering
                createdAt: user.createdAt, // include creation timestamp for display or audit purposes
            },
        });
    } catch (error) { // catch any unexpected errors such as db connection issues
        console.log("Error in register route", error); // log details to assist debugging
        res.status(500).json({ message: "Internal server error" }); // return a generic failure response to the client
    }
});

authRoutes.post("/login", async (req, res) => { // define a post route for logging users in by validating credentials
    try { // begin a try block to safely handle authentication errors
        const { email, password } = req.body; // extract login fields from the request body
        
        if (!email || !password) return res.status(400).json({ message: "All fields are required" }); // reject the request when required fields are missing

        const user = await User.findOne({ email }); // find a user whose email matches the request
        
        if (!user) return res.status(400).json({ message: "Invalid credentials" }); // block login attempts when the account does not exist

        const isPasswordCorrect = await user.comparePassword(password); // verify the supplied password by comparing it with the stored hash
        
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" }); // reject login when the password is incorrect

        const token = generateToken(user._id); // generate a jwt token tied to the authenticated user

        res.status(200).json({ // respond with a success status along with the user info and token
            token, // include session token so the client can authenticate future requests
            user: { // provide essential safe-to-expose user details
                id: user._id, // include user identifier for client-side state
                username: user.username, // include username for display and navigation
                email: user.email, // include email for client reference
                profileImage: user.profileImage, // include profile image for UI rendering
                createdAt: user.createdAt, // include account creation timestamp
            },
        });
    } catch (error) { // handle unexpected runtime failures such as db errors
        console.log("Error in login route", error); // log diagnostic information
        res.status(500).json({ message: "Internal server error" }); // return a general error response
    }
});

export default authRoutes; // export the authentication router for integration into the main app