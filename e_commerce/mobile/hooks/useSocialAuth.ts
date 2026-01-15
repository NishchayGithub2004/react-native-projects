import { useSSO } from "@clerk/clerk-expo"; // import 'useSSO' hook to sign-in user using Google
import { useState } from "react"; // import 'useState' hook to create and manage local variables
import { Alert } from "react-native"; // import 'Alert' component to display alerts to the user

function useSocialAuth() { // define a custom hook called 'useSocialAuth'
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    // create a local variable called 'loadingStrategy' which can have string or null value, initialize it as null
    
    const { startSSOFlow } = useSSO(); // create an instance of 'useSSO' hook

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        // create a function called 'handleSocialAuth' which takes a string parameter called 'strategy' which can either have 'oauth_google' or 'oauth_apple' as value
        setLoadingStrategy(strategy); // set the value of 'loadingStrategy' to the value of 'strategy'

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });
            // sign-in the user with the selected strategy using the instance of 'useSSO' and return it's session ID and 'setActive' function to set the session as active (logged-in)
            
            if (createdSessionId && setActive) await setActive({ session: createdSessionId });
            // if both 'session ID' and'setActive' function are available, set the session as active (logged-in) with the returned session ID
        } catch (error) { // if any error occurs during the sign-in process
            console.log("Error in social auth: ", error); // log the error to the console to know what error occured
            const provider = strategy === "oauth_google" ? "Google" : "Apple"; // check the strategy that was used to log-in
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`); // display an alert to the user with the error message
        } finally {
            setLoadingStrategy(null); // set the value of 'loadingStrategy' to null after the sign-in process is completed
        }
    };

    return { loadingStrategy, handleSocialAuth }; // return the value of 'loadingStrategy' and 'handleSocialAuth' function to the component that uses this hook
}

export default useSocialAuth;