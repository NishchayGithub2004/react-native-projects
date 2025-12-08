import mongoose from "mongoose"; // import mongoose to define schemas and create models for mongodb collections

const bookSchema = new mongoose.Schema( // create a new schema instance to define the structure and validation rules for 'Book' documents
    {
        title: { // define the 'title' field of a book
            type: String, // specify that the title must be a string
            required: true, // enforce that every book must include a title
        },
        caption: { // define the 'caption' field of a book
            type: String, // specify that the caption must be a string
            required: true, // enforce that every book must include a caption
        },
        image: { // define the 'image' field of a book
            type: String, // specify that the image URL must be a string
            required: true, // enforce that every book must contain an associated image URL
        },
        rating: { // define the 'rating' field of a book
            type: Number, // specify that the rating must be numeric
            required: true, // enforce that every book must have a rating
            min: 1, // ensure the rating cannot fall below the lower bound
            max: 5, // ensure the rating cannot exceed the upper bound
        },
        user: { // define the 'user' field to associate a book with its creator
            type: mongoose.Schema.Types.ObjectId, // specify that this field stores an objectid referencing another collection
            ref: "User", // link this id to the 'User' model to enable population
            required: true, // enforce that a book must be associated with a user
        },
    },
    { timestamps: true } // enable automatic creation and updating of 'createdAt' and 'updatedAt' fields for auditing
);

const Book = mongoose.model("Book", bookSchema); // compile the schema into a mongoose model named 'Book' to interact with the books collection

export default Book; // export the book model so it can be used in database operations elsewhere in the application