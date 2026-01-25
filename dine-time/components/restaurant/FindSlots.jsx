import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
/* from 'react-native' library, import the following components: 'View' to render container for layouts, 'Text' to render text,
'TouchableOpacity' to create JSX that does something on touching, 'TextInput' to render text input, and 'Modal' to render text as a popup above the screen */

import React, { useState } from "react"; // import 'React' library to use JSX and 'useState' to create and manage state variables

import AsyncStorage from "@react-native-async-storage/async-storage"; // import 'AsyncStorage' object to store and retrieve data from local storage

import { addDoc, collection } from "firebase/firestore"; // import 'addDoc' function to add a document to a collection and 'collection' function to get a collection/table of the database

import { db } from "../../config/firebaseConfig"; // import 'db' object to connect to database

import { Formik } from "formik"; // import 'Formik' object to create a form and manage its state

import Ionicons from "@expo/vector-icons/Ionicons"; // import 'Ionicons' component to render icons

import validationSchema from "../../utils/guestFormSchema"; // import 'validationSchema' object to validate guest form inputs

const FindSlots = ({ date, selectedNumber, slots, selectedSlot, setSelectedSlot, restaurant }) => { // create a functional component named 'FindSlots' to render UI to see and book slots in restaurant
    const [slotsVisible, setSlotsVisible] = useState(false);
    // create a state variable 'slotsVisible' to show/hide slots with initial value 'false' and a function 'setSlotsVisible' to update it's value
    
    const [modalVisible, setModalVisible] = useState(false);
    // create a state variable 'modalVisible' to show/hide modal/popup message with initial value 'false' and a function'setModalVisible' to update it's value
    
    const [formVisible, setFormVisible] = useState(false);
    // create a state variable'formVisible' to show/hide form with initial value 'false' and a function'setFormVisible' to update it's value
    
    // create a function named 'handlePress' that toggles value of 'slotsVisible' state variable

    const handlePress = () => {
        setSlotsVisible(!slotsVisible);
    };

    const handleBooking = async () => { // create a function named 'handleBooking' to book a slot in the restaurant
        // get user's email and guest status (if user is a guest) from local storage using 'AsyncStorage' object's 'getItem' method
        const userEmail = await AsyncStorage.getItem("userEmail");
        const guestStatus = await AsyncStorage.getItem("isGuest");
        
        if (userEmail) { // if user's email is available
            try {
                await addDoc(collection(db, "bookings"), { // add it's details as a document to 'bookings' collection of the database using 'addDoc' function
                    // provide user's email, selected slot, date of booking, number of guests, and restaurant name to the document
                    email: userEmail,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    restaurant: restaurant,
                });

                alert("Booking successfully Done!"); // show a popup message to user that booking is done
            } catch (error) { // if any error occurs while booking the user
                console.log(error); // log it to the console to know what error occured
            }
        } else if (guestStatus === "true") { // if user's email is not available but the user is a guest
            setFormVisible(true); // set 'formVisible' state variable to 'true' to show form
            setModalVisible(true); // set 'modalVisible' state variable to 'true' to show modal/popup message
        }
    };
    
    // create a function named 'handleCloseModal' that sets 'modalVisible' state variable to 'false' to hide modal/popup message
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };
    
    const handleSlotPress = (slot) => { // create a function named 'handleSlotPress' that takes slot object as argument
        let prevSlot = selectedSlot; // let previous slot as selected slot
        if (prevSlot == slot) setSelectedSlot(null); // if previous slot is same as current one, set selected slot to null
        else setSelectedSlot(slot); // otherwise set selected slot to current slot
    };

    const handleFormSubmit = async (values) => { // create a function named 'handleFormSubmit' that takes 'values' object as argument
        try {
            await addDoc(collection(db, "bookings"), { // add details of user as a document to 'bookings' collection of the database using 'addDoc' function
                ...values, // add all properties of 'values' object using spread operator
                slot: selectedSlot, // also add the slot selected by the user
                date: date.toISOString(), // add the date slot was selected in string form
                guests: selectedNumber, // add the number of guests for the slot
                restaurant: restaurant, // add the restaurant details
            });

            alert("Booking successfully Done!"); // show an alert message that booking was done successfully
            
            setModalVisible(false); // set 'modalVisible' to false to hide the modal/popup message
        } catch (error) { // if any error occurs during the execution of this function
            console.log(error); // log the error that occured to the console
        }
    };

    return (
        <View className="flex-1">
            <View className={`flex ${selectedSlot != null && "flex-row"}`}> {/* apply styles based on whether a slot is selected or not */}
                <View className={`${selectedSlot != null && "flex-1"}`}> {/* apply styles based on whether a slot is selected or not */}
                    <TouchableOpacity onPress={handlePress}> {/* pressing this part calls 'handlePress' function */}
                        <Text className="text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">Find Slots</Text>
                    </TouchableOpacity>
                </View>
                
                {selectedSlot != null && ( // if a slot is selected, render the following part
                    <View className="flex-1">
                        <TouchableOpacity onPress={handleBooking}> {/* pressing this part calls 'handleBooking' function */}
                            <Text className="text-center text-white text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">Book Slot</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            
            {slotsVisible && ( // if slot is supposed to be visible
                <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
                    {slots.map((slot, index) => ( // iterate over all slots as 'slot' with index as unique identifier
                        <TouchableOpacity
                            key={index} // index is the unique identifier of this touchable part for all slots
                            className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot ? "opacity-50" : ""}`}
                            // apply styles based on whether a slot is selected and it is not the same as current slot
                            onPress={() => handleSlotPress(slot)} // touching this part
                            disabled={
                                selectedSlot == slot || selectedSlot == null ? false : true // nothing happens when this part is touched is no slot is selected or selected slot is the same as current slot
                            }
                        >
                            <Text className="text-white font-bold">{slot}</Text> {/* render slot details */}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <Modal
                visible={modalVisible} // this popup message is visible if value of 'modalVisible' is true
                transparent={true} // this popup message is transparent
                animationType="slide"
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    margin: 0,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
            >
                <View className="flex-1 bg-[#00000080] justify-end">
                    <View className="bg-[#474747] mx-4 rounded-t-lg p-4 pb-6">
                        {formVisible && (
                            <Formik
                                initialValues={{ fullName: "", phoneNumber: "" }} // initially value of full name and phone number input field is empty
                                validationSchema={validationSchema} // implement form validation schema to it
                                onSubmit={handleFormSubmit} // submitting this form calls 'handleFormSubmit' function
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                }) => (
                                    <View className="w-full">
                                        <View>
                                            <Ionicons
                                                name="close-sharp"
                                                size={30}
                                                color={"#f49b33"}
                                                onPress={handleCloseModal} // pressing this icon calls 'handleCloseModal' function to hide the modal/popup message
                                            />
                                        </View>
                                        
                                        <Text className="text-[#f49b33] mt-4 mb-2">Name</Text>
                                        
                                        <TextInput
                                            className="h-10 border border-white text-white rounded px-2"
                                            onChangeText={handleChange("fullName")} // when value of this text input changes, 'handleChange' function is called
                                            value={values.fullName} // value of this input field goes to 'fullName' property of 'values' object
                                            onBlur={handleBlur("fullName")} // when this input field is blurred, call 'handleBlur' function
                                        />

                                        {/* if full name is touched and some error occured, render the error */}
                                        {touched.fullName && errors.fullName && (
                                            <Text className="text-red-500 text-xs mb-2">
                                                {errors.fullName}
                                            </Text>
                                        )}
                                        
                                        <Text className="text-[#f49b33] mt-4 mb-2">
                                            Phone Number
                                        </Text>
                                        
                                        <TextInput
                                            className="h-10 border border-white text-white rounded px-2"
                                            onChangeText={handleChange("phoneNumber")} // when value of this text input changes, 'handleChange' function is called
                                            value={values.phoneNumber} // value of this input field goes to 'phoneNumber' property of 'values' object
                                            onBlur={handleBlur("phoneNumber")} // when this input field is blurred, call 'handleBlur' function
                                        />

                                        {/* if phone number is touched and some error occured, render the error */}
                                        {touched.phoneNumber && errors.phoneNumber && (
                                            <Text className="text-red-500 text-xs mb-2">
                                                {errors.phoneNumber}
                                            </Text>
                                        )}

                                        <TouchableOpacity
                                            onPress={handleSubmit} // pressing this part calls 'handleSubmit' function
                                            className="p-2 my-2 bg-[#f49b33]  text-black rounded-lg mt-10"
                                        >
                                            <Text className="text-lg font-semibold text-center">
                                                Submit
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Formik>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default FindSlots;