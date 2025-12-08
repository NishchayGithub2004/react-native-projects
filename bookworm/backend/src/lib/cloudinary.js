import { v2 as cloudinary } from "cloudinary"; // import cloudinary v2 and alias it as 'cloudinary' to access cloudinary's API functions
import "dotenv/config"; // load environment variables at runtime so cloudinary credentials can be read from process.env

cloudinary.config({ // configure cloudinary with required authentication details
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // read the cloud name from environment variables to identify the cloudinary account
    api_key: process.env.CLOUDINARY_API_KEY, // read the API key from environment variables to authenticate requests
    api_secret: process.env.CLOUDINARY_API_SECRET, // read the API secret from environment variables to authorize operations securely
});

export default cloudinary; // export the configured cloudinary instance so it can be used in other modules for uploads and transformations