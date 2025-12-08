import { Tabs } from "expo-router"; // import Tabs to render bottom tab navigation
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to display vector-based tab icons
import COLORS from "../../constants/colors"; // import color constants to maintain theme consistency
import { useSafeAreaInsets } from "react-native-safe-area-context"; // import hook to access safe-area insets for padding adjustments

export default function TabLayout() {
    const insets = useSafeAreaInsets(); // retrieve device-safe-area padding values to adjust UI layout around notches and system bars

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                headerTitleStyle: {
                    color: COLORS.textPrimary,
                    fontWeight: "600",
                },
                headerShadowVisible: false,
                tabBarStyle: {
                    backgroundColor: COLORS.cardBackground,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    paddingTop: 5,
                    paddingBottom: insets.bottom,
                    height: 60 + insets.bottom,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "Create",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}