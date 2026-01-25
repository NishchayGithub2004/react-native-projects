import { View, Text, Image, Platform, ScrollView, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
/* from 'react-native' library, import the following components: 'View' to render JSX container, 'Text' to render text, 'Image' to render images, 'Platform' to render styles and JSX based on platform on which the app is running
'ScrollView' to render scroll bar for a JSX, 'ImageBackground' to render image background, 'FlatList' to render list, 'ActivityIndicator' to render loading spinner, and 'TouchableOpacity' to render JSX touching which executes a function */

import { useRouter } from "expo-router"; // import 'useRouter' hook to navigate b/w different pages
import React, { useEffect, useState } from "react"; // import React to render JSX, 'useEffect' hook to run side-effects and 'useState' hook to create and manage state variables
import { SafeAreaView } from "react-native-safe-area-context"; // import 'SafeAreaView' component to render JSX on screen such that it doesn't overlap
import { BlurView } from "expo-blur"; // import 'BlurView' component to render blur view of JSX
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; // import 'db' instance to interact with the database
import AsyncStorage from "@react-native-async-storage/async-storage"; // import 'AsyncStorage' object to interact with data in local storage

export default function Home() { // create a functional component named 'Home' to render home page
    const router = useRouter(); // create an instance of 'useRouter' hook to use it to navigate b/w different pages
    
    const [restaurants, setRestaurants] = useState([]); // create a state variable 'restaurants' to store array of reestaurants found as array of objects with initial value of empty array and function 'setRestaurants' to change it's value
    
    // create a function named 'temp' that gets values of 'isGuest' and 'userEmail' property and log them to the console 

    const temp = async () => {
        const value = await AsyncStorage.getItem("isGuest");
        const email = await AsyncStorage.getItem("userEmail");
        console.log(value, email);
    };

    const renderItem = ({ item }) => ( // create a function named 'renderItem' that returns UI for an item given as prop
        <TouchableOpacity
            onPress={() => router.push(`/restaurant/${item.name}`)} // pressing this JSX takes user to the restaurant's home page
            className="bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg p-4 mx-4 shadow-md"
        >
            {/* render restaurant's image, name, address, opening and closing time */}
            <Image
                resizeMode="cover"
                source={{ uri: item.image }}
                className="h-28 mt-2 mb-1 rounded-lg"
            />
            <Text className="text-white text-lg font-bold mb-2">{item.name}</Text>
            <Text className="text-white text-base mb-2">{item.address}</Text>
            <Text className="text-white text-base mb-2">
                Open: {item.opening} - Close: {item.closing}
            </Text>
        </TouchableOpacity>
    );

    const getRestaurants = async () => { // create a function named 'getRestaurants' to get restaurant data
        const q = query(collection(db, "restaurants")); // create a query to get documents/rows from 'restaurant' collection/table
        
        const res = await getDocs(q); // execute the query to actually get the data

        // iterate over the extracted data and push it to 'restaurants' array as array of objects using spread operator
        res.forEach((item) => {
            setRestaurants((prev) => [...prev, item.data()]);
        });
    };

    // create a side-effect that runs as soon as the component mounts, it calls 'getRestaurants' and 'temp' functions

    useEffect(() => {
        getRestaurants();
        temp();
    }, []);

    return (
        <SafeAreaView
            style={[
                { backgroundColor: "#2b2b2b" },
                // render style based on whether the app is running on android or iOS
                Platform.OS == "android" && { paddingBottom: 55 },
                Platform.OS == "ios" && { paddingBottom: 20 },
            ]}
        >
            <View className="flex items-center">
                <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex flex-row p-2">
                    <View className="flex flex-row">
                        <Text className={`text-base h-10 ${Platform.OS == "ios" ? "pt-[8px]" : "pt-1"} align-middle text-white`}> {/* render style based on whether the app is running on iOS or not */}
                            {" "}
                            Welcome to{" "}
                        </Text>
                        <Image resizeMode="cover" className={"w-20 h-12"} source={logo} />
                    </View>
                </View>
            </View>

            <ScrollView stickyHeaderIndices={[0]}>
                <ImageBackground
                    resizeMode="cover"
                    className="mb-4 w-full bg-[#2b2b2b] h-52 items-center justify-center"
                    source={banner}
                >
                    <BlurView
                        intensity={Platform.OS === "android" ? 100 : 25} // render blur intensity based on whether the app is running on android or not
                        tint="dark"
                        className="w-full p-4 shadow-lg"
                    >
                        <Text className="text-center text-3xl font-bold text-white">
                            Dine with your loved ones
                        </Text>
                    </BlurView>
                </ImageBackground>
                
                <View className="p-4 bg-[#2b2b2b] flex-row items-center">
                    <Text className="text-3xl text-white mr-2 font-semibold">
                        Special Discount %
                    </Text>
                </View>
                
                {restaurants.length > 0 ? ( // if 'restaurants' array has items ie restaurants, render them as list
                    <FlatList
                        data={restaurants} // use 'restaurants' array to get data to render as list
                        renderItem={renderItem}
                        horizontal
                        contentContainerStyle={{ padding: 16 }}
                        showsHorizontalScrollIndicator={false} // don't render horizontal scrollbar for this list
                        scrollEnabled={true} // don't render scrollbar for this list
                    />
                ) : (
                    <ActivityIndicator animating color={"#fb9b33"} /> // render loading icon if 'restaurants' array is empty
                )}
                
                <View className="p-4 bg-[#2b2b2b] flex-row items-center">
                    <Text className="text-3xl text-[#fb9b33] mr-2 font-semibold">
                        Our Restaurants
                    </Text>
                </View>
                
                {restaurants.length > 0 ? ( // if 'restaurants' array has items ie restaurants, render them as list
                    <FlatList
                        data={restaurants} // use 'restaurants' array to get data to render as list
                        renderItem={renderItem}
                        horizontal
                        contentContainerStyle={{ padding: 16 }}
                        showsHorizontalScrollIndicator={false} // don't render horizontal scrollbar for this list
                        scrollEnabled={true} // don't render scrollbar for this list
                    />
                ) : (
                    <ActivityIndicator animating color={"#fb9b33"} /> // render loading icon if 'restaurants' array is empty
                )}
            </ScrollView>
        </SafeAreaView>
    );
}