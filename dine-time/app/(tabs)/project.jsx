import { View, Text, TouchableOpacity, Alert } from "react-native"; /* from 'react-native' library, import the following components: 'View' to contain JSX, 'Text' to render text
'Alert' to render alert messages, 'TouchableOpacity' to render JSX touching which does some task */

import React, { useEffect, useState } from "react"; // import React to render JSX, 'useEffect' hook to run side-effects, and 'useState' hook to create and manage side effects
import AsyncStorage from "@react-native-async-storage/async-storage"; // import 'AsyncStorage' object to store data in local storage
import { useRouter } from "expo-router"; // import 'useRouter' hook to navigate user to different pages
import { getAuth, signOut } from "firebase/auth"; // import 'getAuth' hook to get user authentication details and 'signOut' hook to sign user out

export default function Profile() { // create a functional component called 'Profile' to render user profile
    const router = useRouter(); // create an instance of 'useRouter' hook to use it to navigate b/w different pages

    const auth = getAuth(); // create an instance of 'getAuth' hook to use it to get user authentication details
    
    const [userEmail, setUserEmail] = useState(null); // create a state variable named 'userEmail' and a function named 'setUserEmail' to update it's value
    
    // create a side-effect that executes as soon as the component mounts, it gets value of 'userEmail' property and set it's value to 'userEmail' state variable using 'setUserEmail' function
    
    useEffect(() => {
        const fetchUserEmail = async () => {
            const email = await AsyncStorage.getItem("userEmail");
            setUserEmail(email);
        };

        fetchUserEmail();
    }, []);
    
    const handleLogout = async () => { // create a function named 'handleLogout' to log out the user
        try {
            await signOut(auth); // sign out the user using 'signOut' hook
            
            await AsyncStorage.removeItem("userEmail"); // remove 'userEmail' property from local storage
            
            setUserEmail(null); // set value of state variable 'userEmail' to null using 'setUserEmail' function

            Alert.alert("Logged out", "You have been logged out successfully."); // show an alert message that user has been logged out successfully
            
            router.push("/signin"); // navigate the user to sign in page
        } catch (error) { // if any error occurs while logging out the user
            Alert.alert("Logged Error", "Error while logging out"); // render an alert message that an error occured while logging out user
        }
    };

    // create a function named 'handleSignup' to take user to sign up page

    const handleSignup = () => {
        router.push("/signup");
    };
    
    return (
        <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
            <Text className="text-xl text-[#f49b33] font-semibold mb-4">
                User Profile
            </Text>
            {userEmail ? ( // if user's email exists
                <>
                    <Text className="text-white text-lg mb-6">Email: {userEmail}</Text>{" "}
                    <TouchableOpacity
                        onPress={handleLogout} // pressing this part calls 'handleLogout' function
                        className="p-2 my-2 bg-[#f49b33]  text-black rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center">Logout</Text>
                    </TouchableOpacity>
                </>
            ) : ( // if user's email does not exist
                <>
                    <TouchableOpacity
                        onPress={handleSignup} // pressing this part calls 'handleSignup' function
                        className="p-2 my-2 bg-[#f49b33]  text-black rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center">Sign Up</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}