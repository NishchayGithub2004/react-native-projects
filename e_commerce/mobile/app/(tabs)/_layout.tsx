import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth(); // from custom hook 'useAuth', extract 'isSignedIn' and 'isLoaded' boolean states
    
    const insets = useSafeAreaInsets(); // create an instance of 'useSafeAreaInsets' hook to get the insets of the device's safe area
    // ie areas where frontend can be placed without any overlapping with the device's hardware

    if (!isLoaded) return null; // if 'isLoaded' is false, return null
    
    if (!isSignedIn) return <Redirect href={"/(auth)"} />; // if 'isSignedIn' is false, redirect to '/(auth)'

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#1DB954",
                tabBarInactiveTintColor: "#B3B3B3",
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    height: 32 + insets.bottom,
                    paddingTop: 4,
                    marginHorizontal: 100,
                    marginBottom: insets.bottom,
                    borderRadius: 24,
                    overflow: "hidden",
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={80}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                ),
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 600,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Shop",
                    tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
                }}
            />
            
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;