import { View, Text, TouchableOpacity } from "react-native"; // from react native library, import 'View' component to render a container, 'Text' component to render text and 'TouchableOpacity' component to render a button that can be pressed
import { Ionicons } from "@expo/vector-icons"; // from expo-vector-icons library, import 'Ionicons' component to render icons

interface ErrorStateProps { // define an interface called 'ErrorStateProps' to define the props for 'ErrorState' component
    // it includes: 'title' and 'description' which are string and are optional to give a value, and 'onRetry' which is a function that takes no argument and returns nothing, all props are optional to be given a value
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({ // create a function called 'ErrorState' that takes properties of interface 'ErrorStateProps' as props
    title = "Something went wrong", // if no value is given to this prop, it by default is set to 'Something went wrong'
    description = "Please check your connection and try again", // if no value is given to this prop, it by default is set to 'Please check your connection and try again'
    onRetry,
}: ErrorStateProps) {
    return (
        <View className="flex-1 bg-background items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
            <Text className="text-text-primary font-semibold text-xl mt-4">{title}</Text>
            <Text className="text-text-secondary text-center mt-2">{description}</Text>
            {onRetry && ( // if 'onRetry' prop is given a value, render a button that calls 'onRetry' function when pressed
                <TouchableOpacity onPress={onRetry} className="mt-4 bg-primary px-6 py-3 rounded-xl">
                    <Text className="text-background font-semibold">Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}