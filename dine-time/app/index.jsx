import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"; /* from react-native library, import the following components:
'Image' to render image, 'ScrollView' to render scroll bar, 'StatusBar' to render status bar, 'Text' to render text, 'TouchableOpacity' to render JSX pressing which executes a function, and 'View' to render JSX container */

import { useRouter } from "expo-router"; // import 'useRouter' hook to navigate user b/w different pages
import { SafeAreaView } from "react-native-safe-area-context"; // import 'SafeAreaView' component to render multiple JSX on screen such that they don't overlap
import logo from "../assets/images/dinetimelogo.png";
const entryImg = require("../assets/images/Frame.png");
import AsyncStorage from "@react-native-async-storage/async-storage"; // import 'AsyncStorage' object to store data in local storage
const logo = require("../assets/images/dinetimelogo.png");

export default function Index() { // create a functional component named 'Index' to render main page
    const router = useRouter(); // create an instance of 'useRouter' hook to use it to navigate b/w different pages

    // create a function named 'handleGuest' that sets value of 'isGuest' property to true in local storage and redirects user to home page
    
    const handleGuest = async () => {
        await AsyncStorage.setItem("isGuest", "true");
        router.push("/home");
    };

    return (
        <SafeAreaView className={`bg-[#2b2b2b]`}>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="m-2 flex justify-center items-center">
                    <Image source={logo} style={{ width: 300, height: 300 }} />
                    
                    <View className="w-3/4">
                        <TouchableOpacity
                            onPress={() => router.push("/signup")} // pressing this text takes user to sign up page
                            className="p-2 my-2 bg-[#f49b33]  text-black rounded-lg "
                        >
                            <Text className="text-lg font-semibold text-center">Sign Up</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={handleGuest} // pressing this text calls 'handleGuest' function
                            className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] rounded-lg max-w-fit "
                        >
                            <Text className="text-lg font-semibold text-[#f49b33] text-center">Guest User</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View>
                        <Text className="text-center text-base  font-semibold my-4 text-white">
                            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> or{" "}
                            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
                        </Text>

                        <TouchableOpacity
                            className="flex flex-row justify-center items-center"
                            onPress={() => router.push("/signin")} // pressing this text takes user to sign in page
                        >
                            <Text className="text-white font-semibold">Already a User? </Text>
                            <Text className="text-base font-semibold underline text-[#f49b33]">Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-1">
                    <Image
                        source={entryImg}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </View>
                
                <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
            </ScrollView>
        </SafeAreaView>
    );
}