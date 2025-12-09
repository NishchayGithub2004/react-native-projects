import { useAuth } from "@clerk/clerk-expo"; // import useAuth to access authentication state such as sign-in status and load status
import { Redirect, Tabs } from "expo-router"; // import Redirect to navigate unauthenticated users and import Tabs to define tab-based navigation layout
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to display vector icons inside the tab bar
import { COLORS } from "../../constants/colors"; // import COLORS to apply consistent color tokens throughout the tab UI

const TabsLayout = () => { // define TabsLayout component to manage tab navigation based on authentication state
    const { isSignedIn, isLoaded } = useAuth(); // extract auth load state and sign-in status from Clerk

    if (!isLoaded) return null; // avoid rendering until authentication state has fully initialized

    if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />; // redirect unauthenticated users to the sign-in screen

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Recipes",
                    tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
                }}
            />
            
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
                }}
            />
            
            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;