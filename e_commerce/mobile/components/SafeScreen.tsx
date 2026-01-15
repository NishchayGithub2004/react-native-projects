import { View } from "react-native"; // from react native library, import 'View' component to render a container
import { useSafeAreaInsets } from "react-native-safe-area-context"; // import 'useSafeAreaInsets' hook to get safe areas of phone screen ie where elements can be placed without any overlapping

const SafeScreen = ({ children }: { children: React.ReactNode }) => { // define a functional component called 'SafeScreen', it takes 'children' as a prop which is JSX
    const insets = useSafeAreaInsets(); // create an instance of 'useSafeAreaInsets' hook to use it

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            {children} {/* render JSX given to this component inside this container as child element */}
        </View>
    );
};

export default SafeScreen;