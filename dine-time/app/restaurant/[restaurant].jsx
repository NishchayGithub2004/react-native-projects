import { View, Text, Platform, ScrollView, FlatList, Dimensions, Image, Linking } from "react-native";
/* from 'react-native' library, render the following components: 'View' to render container of JSX, 'Text' to render text, 'Platform' to render content based on platform the app is running on
'ScrollView' to render a scrollbar for a JSX, 'FlatList' to render list, 'Dimensions' to get screen width and height, 'Image' to render images, and 'Linking' to open external URLs */

import React, { useEffect, useRef, useState } from "react"; // import React to use JSX, 'useEffect' hook to run side effects, 'useRef' hook to directly link to a DOM element
// and 'useState' hook to create and manage state variables and their values

import { useLocalSearchParams } from "expo-router"; // import 'useLocalSearchParams' hook to access and use search parameters
import { SafeAreaView } from "react-native-safe-area-context"; // import 'SafeAreaView' component to render components on a screen without overlapping
import { collection, getDocs, query, where } from "firebase/firestore"; // import 'collection' function to get a collection/table, 'getDocs' to get documents/rows, 'query' to filter result, and 'where' for conditional searching
import { db } from "../../config/firebaseConfig"; // import 'db' instance to get access to database
import Ionicons from "@expo/vector-icons/Ionicons"; // import 'Ioicons' component to render icons

// import date and time picker component, guest picker component and booking slots finding component

import DatePickerComponent from "../../components/restaurant/DatePickerComponent";
import GuestPickerComponent from "../../components/restaurant/GuestPickerComponent";
import FindSlots from "../../components/restaurant/FindSlots";

export default function Restaurant() { // create a functional component named 'Restaurant' to render restaurant UI
    const { restaurant } = useLocalSearchParams(); // create an instance of 'useLocalSearchParams' hook to use it to access and use search parameters
    
    const flatListRef = useRef(null); // create an instance of 'useRef' hook to directly refer to list with initial value of null since initially it doesn't refer to anything
    
    const windowWidth = Dimensions.get("window").width; // get width of the screen the app is currently running on
    
    const [currentIndex, setCurrentIndex] = useState(0); // create a state variable named 'currentIndex' with initial value of 0 and function 'setCurrentIndex' to change it's value
    
    const [restaurantData, setRestaurantData] = useState({}); // create a state variable named 'restaurantData' with initial value of empty object and function 'setRestaurantData' to change it's value
    
    const [carouselData, setCarouselData] = useState({}); // create a state variable named 'carouselData' with initial value of empty object and function 'setCarouselData' to change it's value

    const [slotsData, setSlotsData] = useState({}); // create a state variable named 'slotsData' with initial value of empty object and function 'setSlotsData' to change it's value

    const [selectedSlot, setSelectedSlot] = useState(null); // create a state variable named 'selectedSlot' with initial value of null and function 'setSelectedSlot' to change it's value
    
    const [selectedNumber, setSelectedNumber] = useState(2); // create a state variable named 'selectedNumber' with initial value of 2 and function 'setSelectedNumber' to change it's value
    
    const [date, setDate] = useState(new Date()); // create a state variable named 'date' with initial value of current date and function 'setDate' to change it's value

    const handleNextImage = () => { // create a function named 'handleNextImage' to go to next image
        const carouselLength = carouselData[0]?.images.length; // get the number of images in the carousel
        
        if (currentIndex < carouselLength - 1) { // if the user is not at the last image
            const nextIndex = currentIndex + 1; // determine index of next image
            setCurrentIndex(nextIndex); // set current index to next image
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true }); // scroll smoothly to next image
        }

        if (currentIndex == carouselLength - 1) { // if the user is at the last image
            const nextIndex = 0; // next image to show will be the first image in the carousel
            setCurrentIndex(nextIndex); // set index to first image
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true }); // scroll smoothly to first image
        }
    };

    const handlePrevImage = () => { // create a function named 'handlePrevImage' to go to previous image
        const carouselLength = carouselData[0]?.images.length; // get the number of images in the carousel
        
        if (currentIndex > 0) { // if user is not at first image
            const prevIndex = currentIndex - 1; // determine index of previous image
            setCurrentIndex(prevIndex); // set index to previous image
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true }); // scroll smoothly to previous image
        }

        if (currentIndex == 0) { // if user is at first image
            const prevIndex = carouselLength - 1; // previous image to show will be last image in the carousel
            setCurrentIndex(prevIndex); // set the index to last image
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true }); // scroll smoothly to last image
        }
    };

    const carouselItem = ({ item }) => { // create a function named 'carouselItem' to render carousel item, it takes 'item' object ie item to show as argument
        return (
            <View style={{ width: windowWidth - 2 }} className="h-64 relative"> {/* render this JSX with width 2 units less than width of the screen the app is running on */}
                <View
                    style={{
                        position: "absolute",
                        top: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 50,
                        padding: 5,
                        zIndex: 10,
                        right: "6%",
                    }}
                >
                    <Ionicons
                        onPress={handleNextImage} // pressing this icon calls 'handleNextImage' function
                        name="arrow-forward"
                        size={24}
                        color="white"
                    />
                </View>
                
                <View
                    style={{
                        position: "absolute",
                        top: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 50,
                        padding: 5,
                        zIndex: 10,
                        left: "2%",
                    }}
                >
                    <Ionicons
                        onPress={handlePrevImage} // pressing this icon calls 'handlePrevImage' function
                        name="arrow-back"
                        size={24}
                        color="white"
                    />
                </View>
                
                <View
                    style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        left: "50%",
                        transform: [{ translateX: -50 }],
                        zIndex: 10,
                        bottom: 15,
                    }}
                >
                    {carouselData[0].images?.map((_, i) => ( // iterate over images of the carousel
                        <View
                            key={i} // index of image works as it's unique identifier
                            className={`bg-white h-2 w-2 ${i == currentIndex && "h-3 w-3"} p-1 mx-1 rounded-full`} // apply styles if current index is the same as selected index
                        />
                    ))}
                </View>

                <Image
                    source={{ uri: item }}
                    style={{
                        opacity: 0.5,
                        backgroundColor: "black",
                        marginRight: 20,
                        marginLeft: 5,
                        borderRadius: 25,
                    }}
                    className="h-64"
                />
            </View>
        );
    };

    const getRestaurantData = async () => { // create a function named 'getRestaurantData' to get restaurant data
        try {
            // create a query to extract from 'restaurants' collection/table that document/row where restaurant name is the same as provided name
            const restaurantQuery = query(
                collection(db, "restaurants"),
                where("name", "==", restaurant)
            );
            
            const restaurantSnapshot = await getDocs(restaurantQuery); // execute the query to actually get the required document/row

            // if no such document/row is found, log an error message to the console that no restaurant was found
            if (restaurantSnapshot.empty) {
                console.log("No matching restaurant found");
                return;
            }

            for (const doc of restaurantSnapshot.docs) { // iterate over restaurants found
                const restaurantData = doc.data(); // get the data of current document/row
                
                setRestaurantData(restaurantData); // set restaurant data to the data

                // create a query to extract from 'carousel' collection/table that document/row whose unique ID is the same as current one
                const carouselQuery = query(
                    collection(db, "carousel"),
                    where("res_id", "==", doc.ref)
                );
                
                const carouselSnapshot = await getDocs(carouselQuery); // execute the query to actually get the document/row
                
                const carouselImages = []; // array to store carousel images, initially empty since initially no carousel images are found
                
                // if no desired document is found, log an error message to the console
                if (carouselSnapshot.empty) {
                    console.log("No matching carousel found");
                    return;
                }
                
                // iterate over extracted document/row to push carousel images to the array
                carouselSnapshot.forEach((carouselDoc) => {
                    carouselImages.push(carouselDoc.data());
                });
                
                setCarouselData(carouselImages); // set carousel data to the extracted images

                // create a query to extract from 'slots' collection/table that document/row whose unique ID the same as current document
                const slotsQuery = query(
                    collection(db, "slots"),
                    where("ref_id", "==", doc.ref)
                );
                
                const slotsSnapshot = await getDocs(slotsQuery); // execute the query to extract the document/row
                
                const slots = []; // array to store desired slots
                
                // if no desired slots are found, log an error message to the console
                if (carouselSnapshot.empty) {
                    console.log("No matching slots found");
                    return;
                }
                
                // iterate over extracted document/row to push slots to the array
                slotsSnapshot.forEach((slotDoc) => {
                    slots.push(slotDoc.data());
                });
                
                setSlotsData(slots[0]?.slot); // set slots data to the slots found
            }
        } catch (error) { // if any error occurs while extracting restaurant data
            console.log("Error fetching data", error); // log the error to the console to know what error occured
        }
    };

    const handleLocation = async () => { // create a function named 'handleLocation' to open an external link
        const url = "https://maps.app.goo.gl/TtSmNr394bVp9J8n8"; // external link to go to
        
        const supported = await Linking.canOpenURL(url); // check if it can be opened and we can go to it
        
        if (supported) await Linking.openURL(url); // if we can, go to it
        
        else console.log("Don't know how to open URL", url); // otherwise log an error message to the console that we cannot go to this link
    };

    // create a side-effect of executing 'getRestaurantData' to get restaurant data as soon as the component mounts
    useEffect(() => {
        getRestaurantData();
    }, []);

    return (
        <SafeAreaView
            style={[
                { backgroundColor: "#2b2b2b" },
                // apply padding based on the platform the app is running on
                Platform.OS == "android" && { paddingBottom: 55 },
                Platform.OS == "ios" && { paddingBottom: 20 },
            ]}
        >
            <ScrollView className="h-full">
                <View className="flex-1 my-2 p-2">
                    <Text className="text-xl text-[#f49b33] mr-2 font-semibold">
                        {restaurant} {/* render restaurant details */}
                    </Text>
                    <View className="border-b border-[#f49b33]" />
                </View>
                
                <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
                    <FlatList
                        ref={flatListRef} // make direct reference to the list to do action on them fast
                        data={carouselData[0]?.images} // render list of images in the carousel
                        renderItem={carouselItem} // render items using 'carouselItem' JSX
                        horizontal
                        scrollEnabled={false} // no scroll bar is available for this list
                        showsHorizontalScrollIndicator={false} // no horizontal scrollbar should exist for this list
                        style={{ borderRadius: 25 }}
                    />
                </View>
                
                <View className="flex-1 flex-row mt-2 p-2">
                    <Ionicons name="location-sharp" size={24} color="#f49b33" />
                    
                    <Text className="max-w-[75%] text-white">
                        {restaurantData?.address} |{"  "}
                        
                        <Text
                            onPress={handleLocation} // pressing this text calls 'handleLocation' function
                            className="underline flex items-center mt-1 text-[#f49b33] italic font-semibold"
                        >
                            Get Direction
                        </Text>
                    </Text>
                </View>
                
                <View className="flex-1 flex-row p-2">
                    <Ionicons name="time" size={20} color="#f49b33" />
                    
                    <Text className="max-w-[75%] mx-2 font-semibold text-white">
                        {restaurantData?.opening} - {restaurantData?.closing} {/* render restaurant's opening and closing time */}
                    </Text>
                </View>
                
                <View className="flex-1 border m-2 p-2 border-[#f49b33] rounded-lg">
                    <View className="flex-1 flex-row m-2 p-2 justify-end items-center">
                        <View className="flex-1 flex-row">
                            <Ionicons name="calendar" size={20} color="#f49b33" />
                            
                            <Text className="text-white mx-2 text-base">
                                Select booking date
                            </Text>
                        </View>
                        
                        <DatePickerComponent date={date} setDate={setDate} /> {/* render date picker component */}
                    </View>
                    
                    <View className="flex-1 flex-row bg-[#474747] rounded-lg  m-2 p-2 justify-end items-center">
                        <View className="flex-1 flex-row">
                            <Ionicons name="people" size={20} color="#f49b33" />
                            
                            <Text className="text-white mx-2 text-base">
                                Select number of guests
                            </Text>
                        </View>
                        
                        <GuestPickerComponent selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber} /> {/* render guest picker component */}
                    </View>
                </View>

                <View className="flex-1">
                    {/* render slots finding component */}
                    <FindSlots
                        restaurant={restaurant}
                        date={date}
                        selectedNumber={selectedNumber}
                        slots={slotsData}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}