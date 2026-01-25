import * as Yup from "yup"; // import 'yup' library to create form input validation schema

const validationSchema = Yup.object().shape({ // create a validation schema for user authentication form
    email: Yup.string() // 'email' input field must be given a string value
        .required("Email is required") // this input field is required to be given a value, and if not, this error message will be displayed
        .email("Invalid email format"), // this input field must be given a valid email format, and if not, this error message will be displayed

    password: Yup.string() // 'password' input field must be given a string value
        .required("Password is required") // this input field is required to be given a value, and if not, this error message will be displayed
        .min(6, "Password must be at least 6 characters long"), // this input field must be at least 6 characters long, and if not, this error message will be displayed
});

export default validationSchema; // export the validation schema for use in other parts of the application