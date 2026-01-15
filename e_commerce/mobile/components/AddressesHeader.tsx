import { View, Text, TouchableOpacity } from "react-native"; // from react native library, import the following components
// 'View' to create a container of components, 'Text' to display text, 'TouchableOpacity' to make components clickable
import { Ionicons } from "@expo/vector-icons"; // from expo library, import the 'Ionicons' component to use icons
import { router } from "expo-router"; // from expo-router library, import the 'router' object to programmatically navigate b/w pages

export default function AddressesHeader() {
    return (
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4"> {/* clicking this button takes user back to previous page */}
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" /> {/* render back arrow icon */}
            </TouchableOpacity>
            <Text className="text-text-primary text-2xl font-bold">My Addresses</Text>
        </View>
    );
}