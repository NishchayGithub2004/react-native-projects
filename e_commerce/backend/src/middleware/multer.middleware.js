import multer from "multer"; // import multer middleware from multer package to handle file uploads
import path from "path"; // import path module to work with file paths and extensions

const storage = multer.diskStorage({ // configure multer to store uploaded files in desired directory
    filename: (_, file, cb) => { // define a set of steps to be followed to generate a unique filename for uploaded file
        const ext = path.extname(file.originalname || "").toLowerCase(); // extract file's extension (JPG, PDF, etc.) and convert it to lowercase
        const safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : ""; // keep the extracted extension if it is one of these 4 extensions, otherwise set it to an empty string
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // generate a unique substring that is composed of date the file is uploaded
        // and a random number multiplied by 10^9 and rounded to the nearest integer
        cb(null, `${unique}${safeExt}`); // 'cb' is a callback function that is called after generating a unique filename to signal that naming is completed
        // pass null as the first argument to indicate that no error occurred and the generated filename as the second argument which is it's unique substring and then extension (or empty string)
    },
});

const fileFilter = (_, file, cb) => { // define a function named 'fileFilter' to check if uploaded file is valid or should be rejected
    const allowedTypes = /jpeg|jpg|png|webp/; // specify that the only files with these extensions are allowed
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase()); // check if the given file's extension matches one of the allowed ones
    // this is done by extracting the file's extension, converting it to lowercase, and testing it against the allowed types
    const mimeType = allowedTypes.test(file.mimetype); // check if the given file's MIME type matches one of the allowed ones
    // because user can change extension of a file to bypass the security of the application, but not the MIME type, which is just extension name but more hidden and unchangeable
    if (extname && mimeType) cb(null, true); // if both extension and MIME type are valid, call the callback function 'cb' to signal that file is valid and can be accepted 
    // with null as the first argument to indicate that no error occurred and true as the second argument to indicate that file is accepted
    else cb(new Error("Only image files are allowed (jpeg,jpg,png,webp)")); // otherwise, call the callback function 'cb' with an error object as the first argument 
    // with the message that only files with specified ectensions are allowed
};

export const upload = multer({ // create an instance of multer middleware named 'upload' with specified configuration options
    storage, // storage configuration for unique name of the upload file
    fileFilter, // file filter configuration to check if the uploaded file is valid or not
    limits: { fileSize: 5 * 1024 * 1024 }, // limit the size of the uploaded file to 5MB ie only files having size less than 5MB are allowed
});