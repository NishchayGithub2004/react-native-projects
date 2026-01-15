import { useAuth } from "@clerk/clerk-expo"; // import 'useAuth' hook to get the user's authentication token
import axios from "axios"; // import 'axios' library to make HTTP requests to the backend server
import { useEffect } from "react"; // import 'useEffect' hook to run side effects in functional components

const API_URL = "http://localhost:3000/api"; // this is the base URL for the backend server

const api = axios.create({ // create an instance of 'axios'
    baseURL: API_URL, // this is the base URL for all requests made using this instance
    headers: {
        "Content-Type": "application/json",
    },
});

export const useApi = () => { // create and export a custom hook called 'useApi'
    const { getToken } = useAuth(); // get the user's authentication token using the 'useAuth' hook

    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => { // create an interceptor object that will be called before each request is made
            const token = await getToken(); // get the user's authentication token to make sure only authenticated users can access the backend server
            if (token) config.headers.Authorization = `Bearer ${token}`; // if token exists, add it to the request headers
            return config; // return the configured object
        });
        
        return () => {
            api.interceptors.request.eject(interceptor); // return the interceptor object
        };
    }, [getToken]); // re-run the effect when authentication token changes

    return api; // return the configured instance of 'axios'
};