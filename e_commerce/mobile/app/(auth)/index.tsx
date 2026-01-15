import useSocialAuth from "@/hooks/useSocialAuth"; // umport custom hook 'useSocialAuth' to manage user login stats
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
// from react-native library, import 'View' to render a container, 'Text' to render text, 'Image' to render images, 'TouchableOpacity' to make elements clickable, and 'ActivityIndicator' to show loading spinner

const AuthScreen = () => { // create a functional component 'AuthScreen' to render the login screen
    const { loadingStrategy, handleSocialAuth } = useSocialAuth(); // destructure 'loadingStrategy' and 'handleSocialAuth' from the custom hook 'useSocialAuth' to manage user login stats and handle social authentication events

    return (
        <View className="px-8 flex-1 justify-center items-center bg-white">
            <Image
                source={require("../../assets/images/auth-image.png")}
                className="size-96"
                resizeMode="contain"
            />

            <View className="gap-2 mt-3">
                <TouchableOpacity
                    className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
                    onPress={() => handleSocialAuth("oauth_google")} // pressing this component will trigger the 'handleSocialAuth' function with the provider 'oauth_google' as an argument
                    disabled={loadingStrategy !== null} // if 'loadingStrategy' is not null, disable the button ie touching it will do nothing
                    style={{
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        elevation: 2,
                    }}
                >
                    {loadingStrategy === "oauth_google" ? ( // if loading strategy is 'oauth_google', show a loading spinner, otherwise render google icon and text 'Continue with Google'
                        <ActivityIndicator size={"small"} color={"#4285f4"} />
                    ) : (
                        <View className="flex-row items-center justify-center">
                            <Image
                                source={require("../../assets/images/google.png")}
                                className="size-10 mr-3"
                                resizeMode="contain"
                            />
                            <Text className="text-black font-medium text-base">Continue with Google</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
                    onPress={() => handleSocialAuth("oauth_apple")} // pressing this component will trigger the 'handleSocialAuth' function with the provider 'oauth_apple' as an argument
                    disabled={loadingStrategy !== null} // if 'loadingStrategy' is not null, disable the button ie touching it will do nothing
                    style={{
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        elevation: 2,
                    }}
                >
                    {loadingStrategy === "oauth_apple" ? ( // if loading strategy is 'oauth_apple', show a loading spinner, otherwise render apple icon and text 'Continue with Apple'
                        <ActivityIndicator size={"small"} color={"#4285f4"} />
                    ) : (
                        <View className="flex-row items-center justify-center">
                            <Image
                                source={require("../../assets/images/apple.png")}
                                className="size-8 mr-3"
                                resizeMode="contain"
                            />
                            <Text className="text-black font-medium text-base">Continue with Apple</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
                By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
                {", "}
                <Text className="text-blue-500">Privacy Policy</Text>
                {", and "}
                <Text className="text-blue-500">Cookie Use</Text>
            </Text>
        </View>
    );
};

export default AuthScreen;