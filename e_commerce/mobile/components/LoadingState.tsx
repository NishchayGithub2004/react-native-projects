import { View, Text, ActivityIndicator } from "react-native"; // from react native library, import 'View' component to render a container, 'Text' component to render text and 'ActivityIndicator' component to render a loading spinner

interface LoadingStateProps { // define an interface called 'LoadingStateProps' to define the props for 'LoadingState' component
    // it includes: 'message' and 'color' of type string with optional to have values
    message?: string;
    color?: string;
}

const LoadingState = ({ message = "Loading...", color = "#00D9FF" }: LoadingStateProps) => {
    // if no value is given to 'message' prop, it by default is set to 'Loading...' and if no value is given to 'color' prop, it by default is set to '#00D9FF'
    return (
        <View className="flex-1 bg-background items-center justify-center">
            <ActivityIndicator size={"large"} color={color} /> {/* render a loading spinner of large size and color as per 'color' prop's value */}
            <Text className="text-text-secondary mt-4">{message}</Text> {/* render text as per 'message' prop */}
        </View>
    );
};

export default LoadingState;