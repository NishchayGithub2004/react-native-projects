import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native"; /* from 'react-native' library, import the following components: 'View' to render container of JSX
'Text' to render text, 'FlatList' to render list, 'Alert' to render alert messages, and 'TouchableOpacity' to render JSX pressing which executes some function */

import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"; /* import 'collection' to access a collection/table, 'getDocs' to get documents/rows, 
'getFirestore' to access database, 'query' to create a query to filter data, and 'where' to extract data conditionally */

import React, { useEffect, useState } from "react"; // import React to render JSX, 'useEffect' hook to run side-effects, and 'useState' hook to create and manage side effects
import AsyncStorage from "@react-native-async-storage/async-storage"; // import 'AsyncStorage' object to store data in local storage
import { useRouter } from "expo-router"; // import 'useRouter' hook to navigate user to different pages
import { SafeAreaView } from "react-native-safe-area-context"; // import 'SafeAreaView' component to render JSX on screen such that it doesn't overlap with other JSX

const History = () => { // create a functional component named 'History' to fetch and show bookings history
    const [userEmail, setUserEmail] = useState(null); // create state variable 'userEmail' to store user's email with an initial value of null and function 'setUserEmail' to change it's value
    
    const [bookings, setBookings] = useState([]); // create state variable 'bookings' to store user's bookings with initial value of empty array and function 'setBookings' to change it's value
    
    const [loading, setLoading] = useState(true); // create state variable 'loading' to know if content is being loaded with initial value of true and function 'setLoading' to change it's value
    
    const router = useRouter(); // create an instance of 'useRouter' hook to use it to navigate to different pages
    
    const db = getFirestore(); // create an instance of 'getFirestore' hook to use it to interact with database

    // create a side-effect that executes as soon as the component mounts, it gets value of 'userEmail' property and set it's value to 'userEmail' state variable using 'setUserEmail' function
    
    useEffect(() => {
        const fetchUserEmail = async () => {
            const email = await AsyncStorage.getItem("userEmail");
            setUserEmail(email);
        };

        fetchUserEmail();
    }, []);
    
    const fetchBookings = async () => { // create a function named 'fetchBookings' to fetch bookings of the user
        if (userEmail) { // if user's email exists
            try {
                const bookingCollection = collection(db, "bookings"); // extract 'bookings' collection/table from the database
                
                // create a query to extract documents/rows from 'bookings' collection/table where value of 'email' cell is the same as user's email
                const bookingQuery = query(
                    bookingCollection,
                    where("email", "==", userEmail)
                );
                
                const bookingSnapshot = await getDocs(bookingQuery); // execute the query to actually get the data

                // put the extracted documents/rows in 'bookings' array as array of objects and log a message to the console that data has been extracted successfully

                const bookingList = bookingSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                setBookings(bookingList);
                
                console.log("Data is here: ", bookingList, bookingSnapshot);
            } catch (error) { // if any error occurs while getting user's bookings
                console.log(error); // log the error to the console to know what error occured
                Alert.alert("Error", "Could not fetch bookings"); // render an alert message that bookings could not be fetched
            }
        }

        setLoading(false); // set value of 'loading' to false
    };

    // create a side-effect to get user's bookings using 'fetchBookings' function whenever user email changes

    useEffect(() => {
        fetchBookings();
    }, [userEmail]);

    if (loading) { // if 'loading' is true ie bookings data is being fetched, render 'Loading...' text
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
                <Text>Loading....</Text>
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView className="flex-1 bg-[#2b2b2b]">
            {userEmail ? ( // if user's email is available, render a list of bookings
                <FlatList
                    data={bookings} // 'bookings' array is used to get data to render as list
                    onRefresh={fetchBookings} // refreshing page calls 'fetchBookings' function
                    refreshing={loading} // if value of 'loading' state is true, then refresh the list
                    keyExtractor={(item) => item.id} // iterate over 'bookings' array of objects as 'item' with it's unique ID as each list item's unique identifier
                    renderItem={({ item }) => (
                        // render current booking's date of booking, slot that is booked, number of guests, restaurant name, and user's emil
                        <View className="p-4 border-b border-[#fb9b33]">
                            <Text className="text-white">Date:{item.date}</Text>
                            <Text className="text-white">Slot:{item.slot}</Text>
                            <Text className="text-white">Guests:{item.guests}</Text>
                            <Text className="text-white">Restaurant:{item?.restaurant}</Text>
                            <Text className="text-white">Email:{item.email}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : ( // if user'e email is not available, it means that user is not signed in or registered, hence render a text touching which redirects user to sign in page
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white mb-4">
                        Please sign in to view your booking history
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/signin")}
                        className="p-2 my-2 bg-[#f49b33]  text-black rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center">Sign In</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default History;