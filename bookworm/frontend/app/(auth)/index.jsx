import {
    View, // import view component to structure layout containers on the login screen
    Text, // import text component to render labels and headings
    Image, // import image component to display static or dynamic images on the screen
    TextInput, // import text input to allow entry of email and password values
    TouchableOpacity, // import touchable opacity to create pressable UI elements like login buttons
    ActivityIndicator, // import loading spinner to indicate active authentication requests
    KeyboardAvoidingView, // import wrapper to keep inputs visible when keyboard opens
    Platform, // import platform module to conditionally adjust keyboard behavior
    Alert, // import alert utility to show validation or error messages to the user
} from "react-native"; // import core react-native primitives used to build the login UI

import { Link } from "expo-router"; // import link component to navigate declaratively between screens
import styles from "../../assets/styles/login.styles"; // import stylesheet for consistent login screen styling
import { useState } from "react"; // import react hook to manage local component state such as form inputs
import { Ionicons } from "@expo/vector-icons"; // import icon set to render appropriate symbols inside input fields
import COLORS from "../../constants/colors"; // import theme color constants for consistent UI appearance
import { useAuthStore } from "../../store/authStore"; // import auth store to handle login logic and access authentication state

export default function Login() { // export login component to render UI and handle user authentication
    const [email, setEmail] = useState(""); // maintain email input state so the form stays controlled
    const [password, setPassword] = useState(""); // maintain password input state for login submission
    const [showPassword, setShowPassword] = useState(false); // toggle visibility of password field for user convenience
    const { isLoading, login, isCheckingAuth } = useAuthStore(); // extract loading state and login action from global auth store

    const handleLogin = async () => { // define login handler executed when user submits the login form
        const result = await login(email, password); // call login function to authenticate with provided credentials

        if (!result.success) Alert.alert("Error", result.error); // show alert if authentication fails
    };

    if (isCheckingAuth) return null; // avoid rendering UI until authentication restoration completes

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                        source={require("../../assets/images/i.png")}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.card}>
                    <View style={styles.formContainer}>
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
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email} // bind current email state so the input reflects stored value
                                    onChangeText={setEmail} // update email state on each keystroke to keep the form controlled
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
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password} // bind current password state so the input displays the stored value
                                    onChangeText={setPassword} // update password state with each keystroke to maintain controlled input behavior
                                    secureTextEntry={!showPassword} // mask or reveal password based on visibility toggle state
                                />

                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)} // toggle password visibility when the eye icon is pressed
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"} // switch icon depending on whether password is visible
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin} // execute login logic when user presses the login button
                            disabled={isLoading} // disable button to prevent repeated submissions during an active login attempt
                        >
                            {isLoading ? ( // conditionally render spinner while login request is processing
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>

                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}