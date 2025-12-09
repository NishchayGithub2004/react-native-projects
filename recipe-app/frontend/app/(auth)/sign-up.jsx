import {
    View, // import View to structure layout containers in the UI
    Text, // import Text to render textual content on screen
    Alert, // import Alert to display native alert dialogs
    KeyboardAvoidingView, // import KeyboardAvoidingView to shift UI upward when keyboard opens
    Platform, // import Platform to handle OS-specific behavior or logic
    ScrollView, // import ScrollView to allow vertical scrolling of content
    TextInput, // import TextInput to accept typed user input
    TouchableOpacity, // import TouchableOpacity to create pressable interactive elements
} from "react-native";

import { useRouter } from "expo-router"; // import useRouter to perform navigation actions inside the app
import { useSignUp } from "@clerk/clerk-expo"; // import useSignUp to manage the sign-up lifecycle with Clerk
import { useState } from "react"; // import useState to store and update local component state
import { authStyles } from "../../assets/styles/auth.styles"; // import authStyles to apply predefined authentication UI styles
import { Image } from "expo-image"; // import Image to render performant and optimized images
import { COLORS } from "../../constants/colors"; // import COLORS to use consistent color tokens throughout the UI
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to use vector icons from the Ionicons library
import VerifyEmail from "./verify-email"; // import VerifyEmail component to handle the email verification step

const SignUpScreen = () => {
    const router = useRouter(); // initialize router to navigate between screens

    const { isLoaded, signUp } = useSignUp(); // obtain Clerk sign-up helpers and loading state

    const [email, setEmail] = useState(""); // store the user's email input
    const [password, setPassword] = useState(""); // store the user's password input
    const [showPassword, setShowPassword] = useState(false); // track whether the password should be visible
    const [loading, setLoading] = useState(false); // track whether a sign-up attempt is in progress
    const [pendingVerification, setPendingVerification] = useState(false); // determine whether to show the email verification screen

    const handleSignUp = async () => { // define the handler that manages the full sign-up process
        if (!email || !password) return Alert.alert("Error", "Please fill in all fields"); // validate required input

        if (password.length < 6) return Alert.alert("Error", "Password must be at least 6 characters"); // enforce password length rule

        if (!isLoaded) return; // stop if Clerk has not fully initialized

        setLoading(true); // mark UI as loading while sign-up runs

        try { // attempt account creation and verification setup
            await signUp.create({ emailAddress: email, password }); // create a new user account with Clerk

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" }); // trigger sending a verification code to the provided email

            setPendingVerification(true); // switch UI to show the email verification screen
        } catch (err) { // handle any errors thrown during sign-up
            Alert.alert("Error", err.errors?.[0]?.message || "Failed to create account"); // present the most specific error available
            console.error(JSON.stringify(err, null, 2)); // log detailed error for debugging
        } finally {
            setLoading(false); // always reset the loading state when done
        }
    };

    if (pendingVerification) // conditionally render the verification screen instead of the sign-up UI
        return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />; // pass the email and a callback to return to sign-up

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                style={authStyles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i2.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text style={authStyles.title}>Create Account</Text>

                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter email"
                                placeholderTextColor={COLORS.textLight}
                                value={email} // bind the component's email state to the input field
                                onChangeText={setEmail} // update the email state whenever the user types
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter password"
                                placeholderTextColor={COLORS.textLight}
                                value={password} // bind the current password state to the input field
                                onChangeText={setPassword} // update the password state whenever the user types
                                secureTextEntry={!showPassword} // toggle visibility based on the showPassword state
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)} // invert the showPassword flag when pressed to toggle visibility
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"} // render an icon that reflects whether the password is visible
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]} // apply disabled styling when a sign-up request is in progress
                            onPress={handleSignUp} // execute the sign-up workflow when the button is pressed
                            disabled={loading} // prevent multiple submissions while loading is true
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {loading ? "Creating Account..." : "Sign Up"} {/* display dynamic button text based on loading state */}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.back()} // navigate back to the previous screen when pressed
                        >
                            <Text style={authStyles.linkText}>
                                Already have an account? <Text style={authStyles.link}>Sign In</Text> {/* show link-styled text prompting navigation to sign-in */}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignUpScreen;