import { View, Text } from "react-native"; // from react native library, import 'View' component to render a container and 'Text' component to render text
import { Ionicons } from "@expo/vector-icons"; // from expo-vector-icons library, import 'Ionicons' component to render icons

interface EmptyStateProps { // define an interface called 'EmptyStateProps' to define the props for 'EmptyState' component
    // it includes: 'icon' of type 'glyphMap' from 'Ionicons' component, 'iconSize' of type 'number' to tell dimensions of icon in pixels, 'title' 'description' and 'header' of type string
    icon?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    title: string;
    description?: string;
    header?: string;
}

export function EmptyState({ // create a function called 'EmptyState' that takes properties of interface 'EmptyStateProps' as props
    icon = "folder-open-outline", // if no value is given to this prop, it by default is set to 'folder-open-outline' from 'Ionicons' component
    iconSize = 80, // if no value is given to this prop, it by default is set to 80 pixels
    title,
    description,
    header,
}: EmptyStateProps) {
    return (
        <View className="flex-1 bg-background">
            {header && ( // if 'header' prop is given a value, render this View containing 'header' prop as text
                <View className="px-6 pt-16 pb-5">
                    <Text className="text-text-primary text-3xl font-bold tracking-tight">{header}</Text>
                </View>
            )}
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name={icon} size={iconSize} color="#666" /> {/* render icon with dimensions, both specified by 'icon' and 'iconSize' props respectively */}
                <Text className="text-text-primary font-semibold text-xl mt-4">{title}</Text> {/* render 'title' prop as text */}
                {description && <Text className="text-text-secondary text-center mt-2">{description}</Text>} {/* if 'description' prop is given a value, render it as text */}
            </View>
        </View>
    );
}