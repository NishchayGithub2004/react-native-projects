import { Redirect, Stack } from "expo-router"; // import Redirect to reroute authenticated users, and Stack to define navigation stack
import { useAuth } from "@clerk/clerk-expo"; // import useAuth to access authentication state from Clerk

export default function AuthRoutesLayout() { // define a layout component responsible for auth-based routing
    const { isSignedIn } = useAuth(); // derive the user's authentication state from Clerk

    if (isSignedIn) return <Redirect href={"/"} />; // immediately redirect authenticated users to the home screen

    return <Stack screenOptions={{ headerShown: false }} />; // render the authentication stack with headers disabled
}