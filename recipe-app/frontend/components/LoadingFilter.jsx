import { View, ActivityIndicator, Text, StyleSheet } from "react-native"; // import View for layout, ActivityIndicator for loader UI, Text for displaying messages, and StyleSheet for style definitions
import { COLORS } from "../constants/colors"; // import COLORS to apply consistent theme colors across components

export default function LoadingSpinner({ // define a functional component named LoadingSpinner to display a centered loading indicator which takes following props
    message = "Loading...", // message text to display under the spinner, defaults to "Loading..."
    size = "large" // size of the spinner, defaults to "large"
}) {
    return ( // return UI layout containing loader and optional message
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator size={size} color={COLORS.primary} /> {/* use dynamic size to adjust spinner dimension */}
                <Text style={styles.message}>{message}</Text> {/* render dynamic message text supplied via props */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: COLORS.background,
    },
    content: {
        alignItems: "center",
        gap: 16,
    },
    message: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
    },
});