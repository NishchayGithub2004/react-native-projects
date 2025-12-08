import {
    View, // import view component to structure layout containers in the signup screen
    Text, // import text component to render readable labels and headings
    Platform, // import platform module to apply platform-specific behavior such as keyboard handling
    KeyboardAvoidingView, // import keyboard avoiding view to prevent input fields from being hidden by the keyboard
    TextInput, // import text input component to allow user entry of form fields like username or email
    TouchableOpacity, // import touchable opacity to create pressable UI elements such as submit buttons
    ActivityIndicator, // import activity indicator to display a loading spinner during async operations
    Alert, // import alert utility to display error or informational popups to the user
} from "react-native"; // import core react-native primitives required to build the signup UI

import styles from "../../assets/styles/signup.styles"; // import stylesheet to apply consistent styling to signup screen components
import { Ionicons } from "@expo/vector-icons"; // import ionicons library to render iconography used in input fields and buttons
import COLORS from "../../constants/colors"; // import preset color constants to ensure UI uses consistent theme values
import { useState } from "react"; // import react useState hook to manage internal component state such as form inputs
import { useRouter } from "expo-router"; // import router hook to programmatically navigate between app screens
import { useAuthStore } from "../../store/authStore"; // import auth store to access authentication logic and track user session state

export default function Signup() { // export signup component to render registration UI and handle account creation logic
    const [username, setUsername] = useState(""); // track username input locally so the user can type and update the field
    const [email, setEmail] = useState(""); // track email input locally so registration can submit entered value
    const [password, setPassword] = useState(""); // track password input locally to pass it securely to the register function
    const [showPassword, setShowPassword] = useState(false); // toggle visibility of password field to improve user input experience

    const { user, isLoading, register, token } = useAuthStore(); // extract auth state and register function from global store to manage signup operations

    const router = useRouter(); // create navigation handler to redirect user after successful registration

    const handleSignUp = async () => { // define handler to process signup request when user submits the form
        const result = await register(username, email, password); // call register function to create a new account with provided credentials

        if (!result.success) Alert.alert("Error", result.error); // show error alert when registration fails to inform the user
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>BookWorm🐛</Text>
                        <Text style={styles.subtitle}>Share your favorite reads</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="johndoe"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="johndoe@gmail.com"
                                    value={email}
                                    placeholderTextColor={COLORS.placeholderText}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="******"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password} // bind current password state so the input reflects stored value
                                    onChangeText={setPassword} // update password state on each keystroke so form data stays controlled
                                    secureTextEntry={!showPassword} // toggle password masking based on visibility state for user privacy
                                />

                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)} // toggle password visibility state when the eye icon is pressed
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"} // choose appropriate icon depending on visibility state
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp} // trigger signup handler when user taps the button
                            disabled={isLoading} // disable button during loading to prevent duplicate submissions
                        >
                            {isLoading ? ( // conditionally render spinner when signup request is in progress
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>

                            <TouchableOpacity onPress={() => router.back()}> {/* navigate back to login screen when pressed */}
                                <Text style={styles.link}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}