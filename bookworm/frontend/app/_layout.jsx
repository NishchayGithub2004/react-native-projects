import { Slot, SplashScreen, useRouter, useSegments } from "expo-router"; // import routing utilities and Slot for nested route rendering
import { StatusBar } from "expo-status-bar"; // import StatusBar to control the device status bar appearance
import { useFonts } from "expo-font"; // import hook to load custom fonts before rendering the app
import { useAuthStore } from "../store/authStore"; // import auth store hook to access authentication state
import { useEffect, useState } from "react"; // import React hooks for state and lifecycle management

SplashScreen.preventAutoHideAsync(); // prevent splash screen from auto-hiding until fonts and app state are ready

export default function RootLayout() { // define RootLayout component to manage global routing, auth checks, and font loading
    const router = useRouter(); // obtain router instance to programmatically redirect between routes
    
    const segments = useSegments(); // retrieve current route segments to determine which navigation group is active

    const { checkAuth, user, token } = useAuthStore(); // extract auth checker and auth state (user + token) for session validation

    const [fontsLoaded] = useFonts({ // load custom font assets before rendering UI
        "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    });

    const [isLayoutReady, setIsLayoutReady] = useState(false); // track whether fonts and initial setup are completed

    useEffect(() => { // run effect to trigger authentication state validation
        checkAuth(); // verify stored session and restore user/token if available
    }, []); // run effect only once on mount by passing an empty dependency array

    useEffect(() => { // run effect whenever font-loading status changes
        if (fontsLoaded) { // proceed once fonts have finished loading
            SplashScreen.hideAsync(); // manually hide splash screen now that assets are ready
            setIsLayoutReady(true); // flag layout readiness for subsequent routing logic
        }
    }, [fontsLoaded]);

    useEffect(() => {
        if (!isLayoutReady) return; // exit early until layout initialization completes

        const inAuthScreen = segments[0] === "(auth)"; // check if current route is within the auth group
        
        const isSignedIn = user && token; // determine whether user session is valid

        if (!isSignedIn && !inAuthScreen) router.replace("/(auth)"); // redirect unauthenticated user to login routes
        
        else if (isSignedIn && inAuthScreen) router.replace("/(tabs)"); // redirect authenticated user to main app tabs
    }, [user, token, segments, isLayoutReady]); // re-run effect whenever authentication state, route segments, or layout readiness changes

    return (
        <>
            <Slot />
            <StatusBar style="dark" />
        </>
    );    
}