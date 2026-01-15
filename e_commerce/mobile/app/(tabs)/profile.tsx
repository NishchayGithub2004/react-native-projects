import SafeScreen from "@/components/SafeScreen";
import { useAuth, useUser } from "@clerk/clerk-expo"; // from clerk-expo library, import 'useAuth' hook to get user authentication status
// and 'useUser' hook to get user data
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image"; // from expo-image library, import 'Image' component to display images
import { Ionicons } from "@expo/vector-icons"; // from expo-vector-icons library, import 'Ionicons' component to display icons
import { router } from "expo-router"; // from expo-router library, import 'router' object to navigate between screens

const MENU_ITEMS = [ // create an array of objects to store menu items where each object has an 'id', 'icon', 'title', 'color' and 'action' property
    { id: 1, icon: "person-outline", title: "Edit Profile", color: "#3B82F6", action: "/profile" },
    { id: 2, icon: "list-outline", title: "Orders", color: "#10B981", action: "/orders" },
    { id: 3, icon: "location-outline", title: "Addresses", color: "#F59E0B", action: "/addresses" },
    { id: 4, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
] as const;

const ProfileScreen = () => {
    const { signOut } = useAuth(); // from 'useAuth' hook, import 'signOut' function to sign out user
    
    const { user } = useUser(); // from 'useUser' hook, import 'user' object to get user data

    const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => { // create a function named 'handleMenuPress' that takes value of 'action' property as argument
        if (action === "/profile") return; // if 'action' property value is '/profile', return ie do nothing
        router.push(action); // else, pushv value of 'action' property value to router stack to go to that page
    };

    return (
        <SafeScreen>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="px-6 pb-8">
                    <View className="bg-surface rounded-3xl p-6">
                        <View className="flex-row items-center">
                            <View className="relative">
                                <Image
                                    source={user?.imageUrl} // render user image present in 'imageUrl' property of 'user' object (optional chaining '?' so that if user is not found, then no error occurs) 
                                    style={{ width: 80, height: 80, borderRadius: 40 }}
                                    transition={200}
                                />
                                
                                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                                    <Ionicons name="checkmark" size={16} color="#121212" />
                                </View>
                            </View>

                            <View className="flex-1 ml-4">
                                <Text className="text-text-primary text-2xl font-bold mb-1">
                                    {user?.firstName} {user?.lastName} {/* render user's first and last name */}
                                </Text>
                                
                                <Text className="text-text-secondary text-sm">
                                    {user?.emailAddresses?.[0]?.emailAddress || "No email"} {/* render user's first email or 'No email' if no email is found */}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
                    {MENU_ITEMS.map((item) => ( // iterate over 'MENU_ITEMS' array as 'item'
                        <TouchableOpacity
                            key={item.id} // item's unique ID is the unique identifier of this component
                            className="bg-surface rounded-2xl p-6 items-center justify-center"
                            style={{ width: "48%" }}
                            activeOpacity={0.7}
                            onPress={() => handleMenuPress(item.action)} // pressing this component calls 'handleMenuPress' function and passes value of 'action' property of current object as argument
                        >
                            <View
                                className="rounded-full w-16 h-16 items-center justify-center mb-4"
                                style={{ backgroundColor: item.color + "20" }}
                            >
                                <Ionicons name={item.icon} size={28} color={item.color} /> {/* render icon with color, both defined as properties of 'item' ie current object */}
                            </View>
                            
                            <Text className="text-text-primary font-bold text-base">{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
                    <TouchableOpacity
                        className="flex-row items-center justify-between py-2"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                            <Text className="text-text-primary font-semibold ml-3">Notifications</Text>
                        </View>                        
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
                    <TouchableOpacity
                        className="flex-row items-center justify-between py-2"
                        activeOpacity={0.7}
                        onPress={() => router.push("/privacy-security")} // pressing this component takes user to '/privacy-security' page
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
                            <Text className="text-text-primary font-semibold ml-3">Privacy & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
                    activeOpacity={0.8}
                    onPress={() => signOut()} // pressing this component calls 'signOut' function to sign out user
                >
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text className="text-red-500 font-bold text-base ml-2">Sign Out</Text>
                </TouchableOpacity>

                <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">Version 1.0.0</Text>
            </ScrollView>
        </SafeScreen>
    );
};

export default ProfileScreen;