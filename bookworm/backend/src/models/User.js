import mongoose from "mongoose"; // import mongoose to define schemas and create models for mongodb
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords and perform secure comparisons

const userSchema = new mongoose.Schema( // create a schema describing how user documents must be structured
    {
        username: { // define the 'username' field
            type: String, // enforce storage as a string
            required: true, // ensure every user provides a username
            unique: true, // prevent duplicate usernames across users
        },
        email: { // define the 'email' field
            type: String, // enforce storage as a string
            required: true, // ensure every user provides an email
            unique: true, // prevent multiple accounts from sharing the same email
        },
        password: { // define the 'password' field
            type: String, // enforce storage as an encrypted string
            required: true, // ensure every user provides a password
            minlength: 6, // enforce a minimum security baseline for password length
        },
        profileImage: { // define the 'profileImage' field
            type: String, // enforce storage as a string containing a URL or file path
            default: "", // assign an empty string if the user does not provide one
        },
    },
    { timestamps: true } // automatically record creation and update timestamps for auditability
);

userSchema.pre("save", async function () { // create a pre-save hook to secure passwords before storing them
    if (!this.isModified("password")) return; // skip hashing if the password field was not changed during this update
    
    const salt = await bcrypt.genSalt(10); // generate a cryptographic salt to strengthen the hash
    
    this.password = await bcrypt.hash(this.password, salt); // hash the password with the generated salt and save the result
});

userSchema.methods.comparePassword = async function (userPassword) { // define an instance method to validate a login attempt
    return await bcrypt.compare(userPassword, this.password); // compare the provided password with the stored hash to verify identity
};

const User = mongoose.model("User", userSchema); // compile the schema into a model allowing interactions with the 'users' collection

export default User; // export the model so other modules can create, read, update, or delete user records