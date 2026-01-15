import { v2 as cloudinary } from "cloudinary"; // import 'v2' api of cloudinary with the name 'cloudinary' to work with it
import { ENV } from "./env.js"; // import 'ENV' object from 'env.js' file to load environment variables

cloudinary.config({ // configure cloudinary with the environment variables loaded from 'env.js' file to work with it
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME, // cloud name of cloudinary account to identify the workspace to interact with
    api_key: ENV.CLOUDINARY_API_KEY, // api key of cloudinary account to authenticate user requests
    api_secret: ENV.CLOUDINARY_API_SECRET, // api secret of cloudinary account for secure operations like uploading, deleting, etc.
});

export default cloudinary; // export the configured cloudinary object to use it in other files