import { useRouter } from "expo-router"; // import useRouter to enable programmatic navigation between app routes
import { View, Text, TouchableOpacity } from "react-native"; // import View for layout, Text for labels, and TouchableOpacity for pressable UI elements
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to render iconography such as heart and search icons
import { COLORS } from "@/constants/colors"; // import COLORS for consistent color theming in UI
import { favoritesStyles } from "@/assets/styles/favorites.styles"; // import styling definitions specific to the favorites screen UI

function NoFavoritesFound() { // define a functional component named NoFavoritesFound to show an empty state when no favorite recipes exist
    const router = useRouter(); // initialize the router so navigation actions can be triggered

    return (
        <View style={favoritesStyles.emptyState}>
            <View style={favoritesStyles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={80} color={COLORS.textLight} /> {/* render a large outline heart icon to visually represent empty favorites */}
            </View>
            
            <Text style={favoritesStyles.emptyTitle}>No favorites yet</Text> {/* show a title indicating the user has no favorites */}

            <TouchableOpacity
                style={favoritesStyles.exploreButton}
                onPress={() => router.push("/")} // navigate to home route when user wants to explore recipes
            >
                <Ionicons name="search" size={18} color={COLORS.white} /> {/* render a search icon to reinforce the explore action */}
                <Text style={favoritesStyles.exploreButtonText}>Explore Recipes</Text> {/* label the button with navigation intent */}
            </TouchableOpacity>
        </View>
    );
}

export default NoFavoritesFound; // export component for use in favorites-related screens