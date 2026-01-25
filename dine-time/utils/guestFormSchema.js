import * as Yup from "yup"; // import 'yup' library to create form input validation schema

const validationSchema = Yup.object().shape({ // create a validation schema for guest details form
    fullName: Yup.string() // 'fullName' input field must be given a string value
        .required("Name is required"), // this input field is required to be given a value, and if not, this error message will be displayed

    phoneNumber: Yup.string() // 'phoneNumber' input field must be given a string value
        .required("Phone number is required") // this input field is required to be given a value, and if not, this error message will be displayed
        .matches(/^[0-9]+$/, "Phone number must be digits") // this input field must be given digits only, and if not, this error message will be displayed
        .min(10, "Phone number must be at least 10 digits"), // this input field must be at least 10 digits long, and if not, this error message will be displayed
});

export default validationSchema; // export the validation schema for use in other parts of the application