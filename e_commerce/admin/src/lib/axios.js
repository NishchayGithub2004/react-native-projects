import axios from "axios"; // import 'axios' package to make HTTP requests to backend

const axiosInstance = axios.create({ // configure axios instance
    baseURL: import.meta.env.VITE_API_URL, // this is the base URL to make backend requests at
    withCredentials: true, // this allows cookies to be sent with requests
});

export default axiosInstance; // export the configured axios instance to be used in other parts of the application