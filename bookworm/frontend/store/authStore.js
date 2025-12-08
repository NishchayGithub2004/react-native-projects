import { create } from "zustand"; // import zustand's create function to build a global auth state store for managing authentication data
import AsyncStorage from "@react-native-async-storage/async-storage"; // import async storage to persist auth state so user remains logged in across app sessions
import { API_URL } from "../constants/api"; // import API base url constant to ensure network requests use a centralized endpoint reference

export const useAuthStore = create((set) => ({ // create zustand store instance that exposes auth-related state and allows updating via provided setter
    user: null, // hold authenticated user details so components can reactively access user info
    token: null, // store auth token required for protected API requests
    isLoading: false, // track loading status to control UI states during async login or registration flows
    isCheckingAuth: true, // indicate initial auth check state so the app can block rendering until authentication is validated

    register: async (username, email, password) => { // define async register function to create a new user account using provided credentials
        set({ isLoading: true }); // set loading state to true so UI reflects that a registration request is in progress
        
        try { // start try block to catch operational or network failures during registration
            const response = await fetch(`${API_URL}/auth/register`, { // call backend registration endpoint to create a new user record
                method: "POST", // specify POST method because registration requires sending data to the server
                headers: {
                    "Content-Type": "application/json", // indicate JSON payload so server can parse request body correctly
                },
                body: JSON.stringify({ // serialize registration fields into JSON so backend can validate and store them
                    username, // include username value provided by client
                    email, // include email to identify and contact the user
                    password, // include password needed for account authentication
                }),
            });

            const data = await response.json(); // parse server response into JSON so validation and state updates can use structured data
            if (!response.ok) throw new Error(data.message || "Something went wrong"); // handle backend errors explicitly to provide meaningful feedback
            await AsyncStorage.setItem("user", JSON.stringify(data.user)); // persist user object locally so app restores login state after reload
            await AsyncStorage.setItem("token", data.token); // store auth token so future requests can access protected routes
            set({ token: data.token, user: data.user, isLoading: false }); // update global auth state with authenticated user details and stop loading
            return { success: true }; // return success flag to indicate registration completed without errors
        } catch (error) { // catch block to handle unexpected failures
            set({ isLoading: false }); // reset loading state so UI updates even when registration fails
            return { success: false, error: error.message }; // return error information so caller can display feedback to user
        }
    },

    login: async (email, password) => { // define async login function to authenticate user with provided credentials
        set({ isLoading: true }); // update loading state to indicate authentication process is active

        try { // start try block to capture network or backend validation failures
            const response = await fetch(`${API_URL}/auth/login`, { // send login request to backend to validate credentials
                method: "POST", // specify POST because credentials must be submitted to the server
                headers: {
                    "Content-Type": "application/json", // specify json payload format so backend can decode it
                },
                body: JSON.stringify({ // serialize login fields to send them in request body
                    email, // include user's email for identity verification
                    password, // include password so backend can verify authentication
                }),
            });

            const data = await response.json(); // parse response payload so token and user details can be extracted
            if (!response.ok) throw new Error(data.message || "Something went wrong"); // throw explicit error when authentication fails
            await AsyncStorage.setItem("user", JSON.stringify(data.user)); // persist user info so session survives application reload
            await AsyncStorage.setItem("token", data.token); // store token to allow authorized access to protected endpoints
            set({ token: data.token, user: data.user, isLoading: false }); // update auth store with authenticated session and end loading
            return { success: true }; // return success indicator so caller can update UI accordingly
        } catch (error) { // catch errors from failed login attempt or network issues
            set({ isLoading: false }); // reset loading state so UI no longer shows waiting indicators
            return { success: false, error: error.message }; // return failure details so UI can inform the user
        }
    },

    checkAuth: async () => { // define function to restore authentication state from local storage on app start
        try { // start try block to safely read persistent storage
            const token = await AsyncStorage.getItem("token"); // retrieve stored token so state can be restored
            const userJson = await AsyncStorage.getItem("user"); // retrieve stored user object for session restoration
            const user = userJson ? JSON.parse(userJson) : null; // parse stored user data if it exists to make it usable in state
            set({ token, user }); // update auth store to reflect restored session data
        } catch (error) { // catch errors related to data retrieval or parsing
            console.log("Auth check failed", error); // log issue so debugging can identify why session restoration failed
        } finally { // always execute after try/catch to finalize auth check status
            set({ isCheckingAuth: false }); // mark auth check as complete so the UI can transition out of loading state
        }
    },

    logout: async () => { // define logout function to terminate user session and clear local data
        await AsyncStorage.removeItem("token"); // remove stored token to prevent further authenticated API calls
        await AsyncStorage.removeItem("user"); // remove stored user information to fully clear session persistence
        set({ token: null, user: null }); // update auth store to reflect logged-out state
    },
}));