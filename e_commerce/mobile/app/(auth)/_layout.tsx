import { Redirect, Stack } from "expo-router"; // from expo-router library, import 'Redirect' to redirect the user to a different screen, and 'Stack' to render a stack of screens
import { useAuth } from "@clerk/clerk-expo"; // from clerk-expo library, import 'useAuth' hook to manage user authentication stats

export default function AuthRoutesLayout() { // create a functional component 'AuthRoutesLayout' to render login screen layout
    const { isSignedIn, isLoaded } = useAuth(); // from 'useAuth' hook, destructure 'isSignedIn' and 'isLoaded' to manage user authentication stats

    if (!isLoaded) return null; // if 'isLoaded' is false, render nothing

    if (isSignedIn) {
        return <Redirect href={"/(tabs)"} />; // if user is signed in, redirect them to the home screen
    }

    return <Stack screenOptions={{ headerShown: false }} />; // otherwise, render the login screen stack with 'headerShown' set to false ie no header
}