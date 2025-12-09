import {
    View, // import View to structure layout containers in the UI
    Text, // import Text to render textual content in the UI
    Alert, // import Alert to display native alert dialogs
    KeyboardAvoidingView, // import KeyboardAvoidingView to shift UI when keyboard appears
    Platform, // import Platform to conditionally handle OS-specific logic
    ScrollView, // import ScrollView to enable vertical scrolling of screen content
    TextInput, // import TextInput to capture user-entered text
    TouchableOpacity, // import TouchableOpacity to provide a pressable UI element with feedback
} from "react-native";

import { useSignUp } from "@clerk/clerk-expo"; // import useSignUp to handle Clerk sign-up workflow
import { useState } from "react"; // import useState to manage local component state
import { authStyles } from "../../assets/styles/auth.styles"; // import authStyles to apply authentication-related styling
import { Image } from "expo-image"; // import Image to efficiently render optimized images
import { COLORS } from "../../constants/colors"; // import COLORS to use centralized color tokens across UI

const VerifyEmail = (
    {
        email, // receive the email address being verified
        onBack // receive a callback to navigate back when needed
    } // define a component that verifies a user's email using provided props
) => {
    const { isLoaded, signUp, setActive } = useSignUp(); // destructure Clerk sign-up helpers to manage verification and session activation
    const [code, setCode] = useState(""); // store the user-entered verification code and update it on change
    const [loading, setLoading] = useState(false); // track whether the verification request is currently being processed

    const handleVerification = async () => { // define an async handler to verify the email using Clerk
        if (!isLoaded) return; // exit early if Clerk resources are not fully initialized

        setLoading(true); // mark the UI as busy while verification is running
        try { // attempt the verification and handle success or failure
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code }); // send the verification code to Clerk to validate it

            if (signUpAttempt.status === "complete") { // check if verification successfully completed
                await setActive({ session: signUpAttempt.createdSessionId }); // activate the new authenticated session returned by Clerk
            } else { // handle incomplete or failed verification attempts
                Alert.alert("Error", "Verification failed. Please try again."); // show an alert indicating the failure
                console.error(JSON.stringify(signUpAttempt, null, 2)); // log detailed error info for debugging
            }
        } catch (err) { // catch any thrown error during verification
            Alert.alert("Error", err.errors?.[0]?.message || "Verification failed"); // display the most specific error message available
            console.error(JSON.stringify(err, null, 2)); // log the full error for diagnostics
        } finally {
            setLoading(false); // reset loading state regardless of success or failure
        }
    };

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={authStyles.keyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i3.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text style={authStyles.title}>Verify Your Email</Text>
                    <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter verification code"
                                placeholderTextColor={COLORS.textLight}
                                value={code} // bind the current verification code state to the input field
                                onChangeText={setCode} // update the verification code state whenever the user types
                                keyboardType="number-pad"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]} // apply a disabled style conditionally when loading is true
                            onPress={handleVerification} // trigger the email verification handler when pressed
                            disabled={loading} // prevent pressing the button while verification is in progress
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {loading ? "Verifying..." : "Verify Email"} {/* render different button text based on loading state */}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={onBack} // execute the callback that navigates back to the sign-up screen
                        >
                            <Text style={authStyles.linkText}>
                                <Text style={authStyles.link}>Back to Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default VerifyEmail;