import express from "express"; // import express to create a router for handling book-related HTTP routes
import cloudinary from "../lib/cloudinary.js"; // import cloudinary instance to perform image uploads and deletions for book images
import Book from "../models/Book.js"; // import Book model to interact with the books collection in the database
import protectRoute from "../middleware/auth.middleware.js"; // import middleware to ensure only authenticated users can access these routes

const bookRoutes = express.Router(); // create a new router instance to group all book-related endpoints

bookRoutes.post("/", protectRoute, async (req, res) => { // define POST route to create a new book and apply authentication to restrict access
    try { // start try block to handle operational errors during book creation
        const { title, caption, rating, image } = req.body; // extract required fields from request body to construct a new book document

        if (!image || !title || !caption || !rating) return res.status(400).json({ message: "Please provide all fields" }); // validate required fields to prevent incomplete book records

        const uploadResponse = await cloudinary.uploader.upload(image); // upload the provided image to cloudinary to obtain a hosted URL
        
        const imageUrl = uploadResponse.secure_url; // extract the secure URL so it can be stored in the database for book reference

        const newBook = new Book({ // create a new book document instance to persist in database
            title, // assign book title received from user input
            caption, // assign descriptive caption for the book
            rating, // assign user-given rating for the book
            image: imageUrl, // store the cloudinary-hosted image URL for retrieval
            user: req.user._id, // assign ownership of the book to the authenticated user
        });

        await newBook.save(); // persist the newly created book record in the database

        res.status(201).json(newBook); // return created book to client to confirm successful creation
    } catch (error) { // catch any error that occurs during book creation
        console.log("Error creating book", error); // log error information for debugging server-side issues
        res.status(500).json({ message: error.message }); // send server error response to inform client of failure
    }
});

bookRoutes.get("/", protectRoute, async (req, res) => { // define GET route to fetch all books with pagination and enforce user authentication
    try { // start try block to manage runtime errors while fetching books
        const page = req.query.page || 1; // read page index from query to support pagination and default to first page
        const limit = req.query.limit || 2; // read number of items per page and provide a default to prevent excessive data load
        const skip = (page - 1) * limit; // calculate the number of items to skip for offset pagination

        const books = await Book.find() // query all books from database to return paginated results
            .sort({ createdAt: -1 }) // sort books in descending order of creation time for newest-first display
            .skip(skip) // skip entries based on calculated offset for pagination
            .limit(limit) // limit number of returned books to requested page size
            .populate("user", "username profileImage"); // populate user field with username and profile image for contextual display

        const totalBooks = await Book.countDocuments(); // count total book documents to compute total pages for pagination metadata

        res.send({ // send paginated result set to client for rendering
            books, // include retrieved list of books
            currentPage: page, // include current page index to keep navigation consistent
            totalBooks, // include total book count to determine pagination limits
            totalPages: Math.ceil(totalBooks / limit), // calculate and include total number of pages for UI navigation
        });
    } catch (error) { // catch block for operational failures during fetching
        console.log("Error in get all books route", error); // log underlying error for debugging
        res.status(500).json({ message: "Internal server error" }); // return generic server error response
    }
});

bookRoutes.get("/user", protectRoute, async (req, res) => { // define GET route to fetch books created only by the authenticated user
    try { // start try block to handle execution failures
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 }); // query all books owned by the requesting user and sort newest-first
        res.json(books); // respond with user-specific book list for profile or dashboard display
    } catch (error) { // catch execution errors
        console.error("Get user books error:", error.message); // log error details to support debugging
        res.status(500).json({ message: "Server error" }); // send server error response due to failure
    }
});

bookRoutes.delete("/:id", protectRoute, async (req, res) => { // define DELETE route to remove a book by its ID and enforce authorization
    try { // start try block to manage delete-related failures
        const book = await Book.findById(req.params.id); // fetch target book document by its unique ID to determine if deletion is possible
       
        if (!book) return res.status(404).json({ message: "Book not found" }); // return not found if no matching book exists

        if (book.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Unauthorized" }); // validate that only the book owner can delete it

        if (book.image && book.image.includes("cloudinary")) { // check if book image exists and is hosted on cloudinary to ensure safe deletion
            try { // nested try block to handle cloudinary deletion errors separately
                const publicId = book.image.split("/").pop().split(".")[0]; // extract cloudinary public ID from stored URL to target deletion correctly
                await cloudinary.uploader.destroy(publicId); // call cloudinary to remove the image resource to avoid orphaned files
            } catch (deleteError) { // catch block for failures during cloudinary deletion
                console.log("Error deleting image from cloudinary", deleteError); // log deletion error for debugging
            }
        }

        await book.deleteOne(); // delete the book document from the database to finalize removal

        res.json({ message: "Book deleted successfully" }); // send success response to confirm deletion
    } catch (error) { // outer catch for overall route errors
        console.log("Error deleting book", error); // log main deletion error
        res.status(500).json({ message: "Internal server error" }); // return generic error response to client
    }
});

export default bookRoutes; // export router so it can be mounted into main application routing