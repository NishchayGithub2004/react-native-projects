import { View, Text, TouchableOpacity } from "react-native"; // import View for layout grouping, Text for textual content, and TouchableOpacity for pressable card interaction
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to display metadata icons such as time and servings
import { Image } from "expo-image"; // import Image to render optimized recipe images with caching and transitions
import { useRouter } from "expo-router"; // import useRouter to enable navigation to the recipe details screen
import { COLORS } from "../constants/colors"; // import COLORS for consistent color application across the UI
import { recipeCardStyles } from "../assets/styles/home.styles"; // import styling definitions for the recipe card presentation

export default function RecipeCard({ // define a functional component named RecipeCard to render recipe information in a tappable card which takes following props
    recipe // recipe object containing image, title, metadata, and identifiers used to populate the card
}) {
    const router = useRouter(); // initialize router so navigation to the recipe details screen can be triggered on card tap

    return (
        <TouchableOpacity
            style={recipeCardStyles.container}
            onPress={() => router.push(`/recipe/${recipe.id}`)} // navigate to recipe details page using recipe ID when card is pressed
            activeOpacity={0.8}
        >
            <View style={recipeCardStyles.imageContainer}>
                <Image
                    source={{ uri: recipe.image }} // load recipe image received from recipe object
                    style={recipeCardStyles.image}
                    contentFit="cover"
                    transition={300}
                />
            </View>

            <View style={recipeCardStyles.content}>
                <Text style={recipeCardStyles.title} numberOfLines={2}>
                    {recipe.title} {/* render recipe title, truncated to two lines */}
                </Text>
                
                {recipe.description && ( // conditionally display recipe description only if present in recipe object
                    <Text style={recipeCardStyles.description} numberOfLines={2}>
                        {recipe.description} {/* truncated description content */}
                    </Text>
                )}

                <View style={recipeCardStyles.footer}>
                    {recipe.cookTime && ( // conditionally display cook time section if cook time exists
                        <View style={recipeCardStyles.timeContainer}>
                            <Ionicons name="time-outline" size={14} color={COLORS.textLight} /> {/* render clock icon to represent cook time */}
                            <Text style={recipeCardStyles.timeText}>{recipe.cookTime}</Text> {/* display cook time value */}
                        </View>
                    )}
                    
                    {recipe.servings && ( // conditionally display servings section if servings exist
                        <View style={recipeCardStyles.servingsContainer}>
                            <Ionicons name="people-outline" size={14} color={COLORS.textLight} /> {/* render people icon to represent servings */}
                            <Text style={recipeCardStyles.servingsText}>{recipe.servings}</Text> {/* display servings count */}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}