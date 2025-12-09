import {
    View, // import View to structure fundamental layout containers in the UI
    Text, // import Text to render textual content on screen
    Alert, // import Alert to show native alert dialogs for errors or messages
    KeyboardAvoidingView, // import KeyboardAvoidingView to adjust layout when the keyboard appears
    Platform, // import Platform to apply OS-specific logic when needed
    ScrollView, // import ScrollView to enable vertical scrolling for long content
    TextInput, // import TextInput to capture user-entered text
    TouchableOpacity, // import TouchableOpacity to create interactive pressable elements
} from "react-native";

import { useSignIn } from "@clerk/clerk-expo"; // import useSignIn to manage the Clerk sign-in workflow
import { useRouter } from "expo-router"; // import useRouter to perform navigational actions
import { useState } from "react"; // import useState to manage local reactive component state
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to use vector-based UI icons
import { Image } from "expo-image"; // import Image to render efficient, optimized images
import { authStyles } from "../../assets/styles/auth.styles"; // import authStyles to apply predefined authentication styling
import { COLORS } from "../../constants/colors"; // import COLORS to use consistent global color tokens

const SignInScreen = () => {
    const router = useRouter(); // initialize router to handle screen navigation

    const { signIn, setActive, isLoaded } = useSignIn(); // extract Clerk sign-in helpers and loading state

    const [email, setEmail] = useState(""); // store the user-entered email
    const [password, setPassword] = useState(""); // store the user-entered password
    const [showPassword, setShowPassword] = useState(false); // control whether the password is visible or hidden
    const [loading, setLoading] = useState(false); // track whether a sign-in request is currently being processed

    const handleSignIn = async () => { // define the full sign-in workflow handler
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields"); // validate required inputs
            return;
        }

        if (!isLoaded) return; // exit early if Clerk has not finished initializing

        setLoading(true); // show loading state during the sign-in process

        try { // attempt the sign-in request
            const signInAttempt = await signIn.create({
                identifier: email, // provide the email identifier for authentication
                password, // provide the password for authentication
            });

            if (signInAttempt.status === "complete") { // check if Clerk sign-in completed successfully
                await setActive({ session: signInAttempt.createdSessionId }); // activate the returned authenticated session
            } else { // handle incomplete sign-in attempts
                Alert.alert("Error", "Sign in failed. Please try again."); // notify user of failure
                console.error(JSON.stringify(signInAttempt, null, 2)); // log failure details for debugging
            }
        } catch (err) { // catch any thrown errors from the sign-in operation
            Alert.alert("Error", err.errors?.[0]?.message || "Sign in failed"); // present the most specific error message available
            console.error(JSON.stringify(err, null, 2)); // log full error for diagnostics
        } finally {
            setLoading(false); // reset loading state after success or failure
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
                            source={require("../../assets/images/i1.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text style={authStyles.title}>Welcome Back</Text>

                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter email"
                                placeholderTextColor={COLORS.textLight}
                                value={email} // bind the component's email state to the input field
                                onChangeText={setEmail} // update the email state when the user types
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
                                secureTextEntry={!showPassword} // toggle masked or visible password text based on showPassword state
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)} // toggle the visibility of the password input
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"} // choose icon depending on visibility state
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]} // conditionally apply disabled styling when loading is true
                            onPress={handleSignIn} // trigger sign-in logic when pressed
                            disabled={loading} // block interaction during an ongoing sign-in attempt
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {loading ? "Signing In..." : "Sign In"} {/* dynamically show progress text based on loading state */}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.push("/(auth)/sign-up")} // navigate to the sign-up screen
                        >
                            <Text style={authStyles.linkText}>
                                Don&apos;t have an account? <Text style={authStyles.link}>Sign up</Text> {/* render link-styled call to action for sign-up navigation */}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignInScreen;