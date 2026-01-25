import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert } from "react-native";
/* from react-native library, import the following components: 'View' to render container of JSX, 'Text' to render a text, 'ScrollView' to render a scroll bar for a JSX
'TouchableOpacity' to render JSX touching with does some action, 'Image' to render images, 'StatusBar' to render a status bar, 'TextInput' to render a text input, 'Alert' to render an alert message */

import { useRouter } from "expo-router"; // import 'useRouter' hook to navigate user to different pages
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; // import hook to create a new user with email and password and to get authentication status of a user
import React from "react"; // import react library to render JSX
import { SafeAreaView } from "react-native-safe-area-context"; // import 'SafeAreaView' component to render components at places on screen where no overlay can happen
import logo from "../../assets/images/dinetimelogo.png";
const entryImg = require("../../assets/images/Frame.png");
import { Formik } from "formik"; // import 'Formik' component to create forms and manage it's states
import validationSchema from "../../utils/authSchema"; // import validation schema of form input fields for user authentication
import { doc, getFirestore, setDoc } from "firebase/firestore"; // import 'doc' function to get a document/row, 'getFirestore' hook to get access to firebase database, and 'setDoc' to add a document/row to collection/table
import AsyncStorage from "@react-native-async-storage/async-storage"; // import 'AsyncStorage' object to store data in local storage

const Signup = () => { // create a functional component named 'Signup' to render signup UI
    const router = useRouter(); // create an instance of 'useRouter' hook to navigate b/w different pages
    const auth = getAuth(); // create an instance of 'getAuth' hook to get user's authentication status
    const db = getFirestore(); // create an instance of 'getFirestore' hook to get user's database

    const handleGuest = async () => { // create a function named 'handleGuest' to handle a guest's status
        await AsyncStorage.setItem("isGuest", "true"); // set it's 'isGuest' property to true since new user is a guest now
        router.push("/home"); // navigate user to home page
    };

    const handleSignup = async (values) => { // create a function named 'handleSignup' to handle user registeration, it takes form field inputs in 'values' object
        try {
            // create user in firebase authentication with provided email and password
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            
            const user = userCredentials.user; // get the user from it's registeration credentials
            
            // push the created user to 'users' collection/table with a unique ID, push it's email and date the user registered
            await setDoc(doc(db, "users", user.uid), {
                email: values.email,
                createdAt: new Date(),
            });
            
            await AsyncStorage.setItem("userEmail", values.email); // set value of 'userEmail' property to email given by user in local storage
            
            await AsyncStorage.setItem("isGuest", "false"); // set value of 'isGuest' property to false in local storage
            
            router.push("/home"); // redirect the user to home page
        } catch (error) { // if any error occurs while registering the user
            if (error.code === "auth/email-already-in-use") { // if user is already in database
                // render an alert message that user with provided email already exists with an OK button
                Alert.alert(
                    "Signup Failed!",
                    "This email address is already in use. Please use a different email.",
                    [{ text: "OK" }]
                );
            } else {
                // otherwise render an alert message that unexpected error occured during user registeration with an OK button
                Alert.alert(
                    "Signup Error",
                    "An unexpected error occurred. Please try again later.",
                    [{ text: "OK" }]
                );
            }
        }
    };

    return (
        <SafeAreaView className={`bg-[#2b2b2b]`}>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="m-2 flex justify-center items-center">
                    <Image source={logo} style={{ width: 200, height: 100 }} />
                    
                    <Text className="text-lg text-center text-white  font-bold mb-10">
                        Let's get you started
                    </Text>

                    <View className="w-5/6">
                        <Formik
                            initialValues={{ email: "", password: "" }} // initial values of form input fields is empty string
                            validationSchema={validationSchema} // implement the form input validation schema on it
                            onSubmit={handleSignup} // submitting this form calls 'handleSignup' function
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
                                    <Text className="text-[#f49b33] mt-4 mb-2">Email</Text>
                                    
                                    <TextInput
                                        className="h-10 border border-white text-white rounded px-2"
                                        keyboardType="email-address"
                                        onChangeText={handleChange("email")} // call 'handleChange' function when value of this input field changes
                                        value={values.email} // value given in this input field goes to 'email' property of 'values' object
                                        onBlur={handleBlur("email")} // when the input field is blurred, call 'handleBlur' function
                                    />

                                    {/* if email input field is touched and an error occurs, render it */}
                                    {touched.email && errors.email && (
                                        <Text className="text-red-500 text-xs mb-2">
                                            {errors.email}
                                        </Text>
                                    )}
                                    
                                    <Text className="text-[#f49b33] mt-4 mb-2">Password</Text>
                                    
                                    <TextInput
                                        className="h-10 border border-white text-white rounded px-2"
                                        secureTextEntry
                                        onChangeText={handleChange("password")} // call 'handleChange' function when value of this input field changes
                                        value={values.password} // value given in this input field goes to 'password' property of 'values' object
                                        onBlur={handleBlur("password")} // when the input field is blurred, call 'handleBlur' function
                                    />

                                    {/* if password input field is touched and an error occurs, render it */}
                                    {touched.password && errors.password && (
                                        <Text className="text-red-500 text-xs mb-2">
                                            {errors.password}
                                        </Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={handleSubmit} // pressing this part calls 'handleSubmit' function
                                        className="p-2 my-2 bg-[#f49b33]  text-black rounded-lg mt-10"
                                    >
                                        <Text className="text-lg font-semibold text-center">
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                        
                        <View className="flex justify-center items-center">
                            <TouchableOpacity
                                className="flex flex-row justify-center mt-5 p-2 items-center"
                                onPress={() => router.push("/signin")} // pressing this part takes user to signin page since it is already signed up
                            >
                                <Text className="text-white font-semibold">
                                    Already a User?{" "}
                                </Text>
                                
                                <Text className="text-base font-semibold underline text-[#f49b33]">
                                    Sign in
                                </Text>
                            </TouchableOpacity>

                            <Text className="text-center text-base  font-semibold mb-4 text-white">
                                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />{" "}
                                or{" "}
                                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
                            </Text>
                            
                            <TouchableOpacity
                                className="flex flex-row justify-center mb-5 p-2 items-center"
                                onPress={handleGuest} // pressing this part calls 'handleGuest' function
                            >
                                <Text className="text-white font-semibold">Be a</Text>
                                
                                <Text className="text-base font-semibold underline text-[#f49b33]">
                                    {" "}
                                    Guest User
                                </Text>
                            </TouchableOpacity>
                        </View>
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
};

export default Signup;