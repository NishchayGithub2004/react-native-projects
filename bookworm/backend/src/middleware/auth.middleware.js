import jwt from "jsonwebtoken"; // import jsonwebtoken to decode and validate jwt tokens used for authentication
import User from "../models/User.js"; // import the user model to retrieve user records when validating a token

const protectRoute = async (req, res, next) => { // define async middleware 'protectRoute' to authenticate requests before allowing access
    try { // begin error-handling block to catch issues during authentication
        const token = req.header("Authorization").replace("Bearer ", ""); // extract the jwt token from the authorization header by removing the bearer prefix
        
        if (!token) return res.status(401).json({ message: "No authentication token, access denied" }); // immediately reject the request if no token is provided
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the jwt token using the server's secret key and decode its payload
        
        const user = await User.findById(decoded.userId).select("-password"); // fetch the user associated with the token's payload while excluding sensitive fields
        
        if (!user) return res.status(401).json({ message: "Token is not valid" }); // deny access if the decoded user does not exist in the database
        
        req.user = user; // attach the authenticated user object to the request so downstream handlers can access it
        
        next(); // move forward to the next middleware or route handler when authentication succeeds
    } catch (error) { // catch and handle errors such as invalid tokens or verification failures
        console.error("Authentication error:", error.message); // log the authentication failure for debugging
        res.status(401).json({ message: "Token is not valid" }); // send unauthorized response indicating authentication failed
    }
};

export default protectRoute; // export the middleware so it can be used to guard protected routes throughout the application