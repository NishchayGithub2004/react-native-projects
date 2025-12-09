import {
    View, // import View to structure layout containers in the UI
    Text, // import Text to render textual content in the UI
    Alert, // import Alert to display system alert dialogues
    ScrollView, // import ScrollView to enable vertical scrolling of content
    TouchableOpacity // import TouchableOpacity to provide pressable UI elements with opacity feedback
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router"; // import useLocalSearchParams to access route params and useRouter to navigate between screens
import { useEffect, useState } from "react"; // import useEffect for side effects and useState for managing component state
import { useUser } from "@clerk/clerk-expo"; // import useUser to access authenticated user information from Clerk
import { API_URL } from "../../constants/api"; // import API_URL to access the base API endpoint for application network requests
import { MealAPI } from "../../services/mealAPI"; // import MealAPI to perform meal-related API interactions
import LoadingSpinner from "../../components/LoadingSpinner"; // import LoadingSpinner to display a loading indicator during data fetching
import { Image } from "expo-image"; // import Image to efficiently render remote images in the UI
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles"; // import recipeDetailStyles to apply predefined styling for the recipe detail screen
import { LinearGradient } from "expo-linear-gradient"; // import LinearGradient to render gradient backgrounds or overlays
import { COLORS } from "../../constants/colors"; // import COLORS to use centralized color tokens across the UI
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to render iconography throughout the screen
import { WebView } from "react-native-webview"; // import WebView to embed and display web content inside the application

const RecipeDetailScreen = () => { // define a functional component responsible for displaying detailed information about a selected recipe
    const { id: recipeId } = useLocalSearchParams(); // extract the 'id' route parameter and rename it to recipeId for clarity

    const router = useRouter(); // initialize the router object to enable programmatic navigation within the app

    const [recipe, setRecipe] = useState(null); // create state to store the full recipe details once fetched
    const [loading, setLoading] = useState(true); // track whether the screen is still fetching or processing recipe data
    const [isSaved, setIsSaved] = useState(false); // track whether the current recipe is already saved by the user
    const [isSaving, setIsSaving] = useState(false); // track whether a save operation is currently in progress to prevent duplicate actions

    const { user } = useUser(); // retrieve the authenticated user object from Clerk

    const userId = user?.id; // safely extract the user’s ID if available, allowing save-related logic to function conditionally

    useEffect(() => { // execute side effects when recipeId or userId changes
        const checkIfSaved = async () => { // define an async function to verify whether the current recipe is saved by the user
            try { // begin error-handled execution for the fetch request
                const response = await fetch(`${API_URL}/favorites/${userId}`); // request the user's saved favorites from the backend using their userId
                const favorites = await response.json(); // parse the backend response to obtain the favorites list
                const isRecipeSaved = favorites.some((fav) => fav.recipeId === parseInt(recipeId)); // determine if the current recipeId exists in the favorites array
                setIsSaved(isRecipeSaved); // update state to reflect whether the recipe is saved
            } catch (error) { // handle any network or parsing errors
                console.error("Error checking if recipe is saved:", error); // log the error for debugging purposes
            }
        };

        const loadRecipeDetail = async () => { // define an async function that retrieves and prepares the detailed meal data
            setLoading(true); // indicate that the recipe detail loading process has started

            try { // begin protected execution for the data-fetch sequence
                const mealData = await MealAPI.getMealById(recipeId); // request full meal details from the API using the recipeId

                if (mealData) { // ensure that a valid meal object was returned
                    const transformedRecipe = MealAPI.transformMealData(mealData); // normalize the raw API meal data into structured application format

                    const recipeWithVideo = { // augment the normalized recipe with a YouTube link when available
                        ...transformedRecipe, // spread the transformed recipe fields into the new object
                        youtubeUrl: mealData.strYoutube || null, // attach the YouTube URL or null if the recipe has no video
                    };

                    setRecipe(recipeWithVideo); // store the fully prepared recipe in state for rendering
                }
            } catch (error) { // handle failures such as missing data or network errors
                console.error("Error loading recipe detail:", error); // log the failure to support troubleshooting
            } finally { // ensure cleanup occurs regardless of success or failure
                setLoading(false); // signal that the loading process has completed
            }
        };

        checkIfSaved(); // invoke the saved-status check for the current recipe
        loadRecipeDetail(); // initiate retrieval and normalization of the recipe details
    }, [recipeId, userId]); // re-run the effect whenever the recipeId or userId changes

    const getYouTubeEmbedUrl = (url) => { // define a helper function that converts a YouTube watch URL into an embeddable URL
        const videoId = url.split("v=")[1]; // extract the YouTube video ID from the query parameter
        return `https://www.youtube.com/embed/${videoId}`; // return the embeddable YouTube URL format
    };

    const handleToggleSave = async () => { // define an async handler that toggles the saved/unsaved state of the current recipe
        setIsSaving(true); // set a flag indicating that a save/remove operation is currently in progress

        try { // begin controlled execution to handle network-related failures
            if (isSaved) { // check whether the recipe is already saved for the current user
                const response = await fetch(`${API_URL}/favorites/${userId}/${recipeId}`, { // send a DELETE request to remove the recipe from favorites
                    method: "DELETE", // specify that this request removes an existing resource
                });

                if (!response.ok) throw new Error("Failed to remove recipe"); // throw an error when the server reports a failure

                setIsSaved(false); // update UI state to reflect that the recipe is no longer saved
            } else { // execute logic for saving a new recipe to the user’s favorites
                const response = await fetch(`${API_URL}/favorites`, { // send a POST request to add the recipe to the favorites list
                    method: "POST", // specify that this request creates a new resource
                    headers: {
                        "Content-Type": "application/json", // indicate that the request body contains JSON data
                    },
                    body: JSON.stringify({ // serialize the recipe and user metadata for storage on the backend
                        userId, // associate the saved recipe with the authenticated user’s ID
                        recipeId: parseInt(recipeId), // ensure recipeId is stored as a number on the backend
                        title: recipe.title, // save the recipe’s title for display in the favorites list
                        image: recipe.image, // save the recipe’s image for UI rendering
                        cookTime: recipe.cookTime, // store the recipe’s stated cook time
                        servings: recipe.servings, // store the number of servings associated with the recipe
                    }),
                });

                if (!response.ok) throw new Error("Failed to save recipe"); // throw an error if the backend rejects the operation

                setIsSaved(true); // update UI state to reflect that the recipe is now saved
            }
        } catch (error) { // catch and handle any exception that occurs during save/remove operations
            console.error("Error toggling recipe save:", error); // log the technical error to assist with debugging
            Alert.alert("Error", `Something went wrong. Please try again.`); // show an alert informing the user of the failure
        } finally { // run cleanup tasks regardless of success or failure
            setIsSaving(false); // reset the saving flag to re-enable save/remove interactions
        }
    };

    if (loading) return <LoadingSpinner message="Loading recipe details..." />; // render a loading spinner component with a dynamic message while recipe details are still being fetched    

    return (
        <View style={recipeDetailStyles.container}>
            <ScrollView>
                <View style={recipeDetailStyles.headerContainer}>
                    <View style={recipeDetailStyles.imageContainer}>
                        <Image
                            source={{ uri: recipe.image }} // provide the dynamic image URI so the component can render the recipe’s thumbnail
                            style={recipeDetailStyles.headerImage}
                            contentFit="cover"
                        />
                    </View>

                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
                        style={recipeDetailStyles.gradientOverlay}
                    />

                    <View style={recipeDetailStyles.floatingButtons}>
                        <TouchableOpacity
                            style={recipeDetailStyles.floatingButton}
                            onPress={() => router.back()} // trigger navigation to the previous screen when the back button is pressed
                        >
                            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                recipeDetailStyles.floatingButton,
                                { backgroundColor: isSaving ? COLORS.gray : COLORS.primary }, // dynamically adjust button color based on whether a save operation is in progress
                            ]}
                            onPress={handleToggleSave} // execute the save/unsave toggle logic when pressed
                            disabled={isSaving} // disable interaction while the save/unsave request is being processed
                        >
                            <Ionicons
                                name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"} // choose the icon based on saving state and saved/not-saved status
                                size={24}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={recipeDetailStyles.titleSection}>
                        <View style={recipeDetailStyles.categoryBadge}>
                            <Text style={recipeDetailStyles.categoryText}>
                                {recipe.category} {/* render the recipe’s category retrieved from API data */}
                            </Text>
                        </View>

                        <Text style={recipeDetailStyles.recipeTitle}>
                            {recipe.title} {/* render the recipe title generated from transformed meal data */}
                        </Text>

                        {recipe.area && ( // conditionally display the cuisine origin only when the recipe includes area metadata
                            <View style={recipeDetailStyles.locationRow}>
                                <Ionicons name="location" size={16} color={COLORS.white} />
                                <Text style={recipeDetailStyles.locationText}>
                                    {recipe.area} Cuisine {/* render the recipe’s geographical cuisine classification */}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={recipeDetailStyles.contentSection}>
                    <View style={recipeDetailStyles.statsContainer}>
                        <View style={recipeDetailStyles.statCard}>
                            <LinearGradient
                                colors={["#FF6B6B", "#FF8E53"]}
                                style={recipeDetailStyles.statIconContainer}
                            >
                                <Ionicons name="time" size={20} color={COLORS.white} />
                            </LinearGradient>

                            <Text style={recipeDetailStyles.statValue}>
                                {recipe.cookTime} {/* display the recipe’s cook duration sourced from normalized recipe data */}
                            </Text>

                            <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
                        </View>

                        <View style={recipeDetailStyles.statCard}>
                            <LinearGradient
                                colors={["#4ECDC4", "#44A08D"]}
                                style={recipeDetailStyles.statIconContainer}
                            >
                                <Ionicons name="people" size={20} color={COLORS.white} />
                            </LinearGradient>

                            <Text style={recipeDetailStyles.statValue}>
                                {recipe.servings} {/* display the number of servings defined for the recipe */}
                            </Text>

                            <Text style={recipeDetailStyles.statLabel}>Servings</Text>
                        </View>
                    </View>

                    {recipe.youtubeUrl && ( // conditionally render the video tutorial section only when a YouTube URL exists
                        <View style={recipeDetailStyles.sectionContainer}>
                            <View style={recipeDetailStyles.sectionTitleRow}>
                                <LinearGradient
                                    colors={["#FF0000", "#CC0000"]}
                                    style={recipeDetailStyles.sectionIcon}
                                >
                                    <Ionicons name="play" size={16} color={COLORS.white} />
                                </LinearGradient>

                                <Text style={recipeDetailStyles.sectionTitle}>Video Tutorial</Text>
                            </View>

                            <View style={recipeDetailStyles.videoCard}>
                                <WebView
                                    style={recipeDetailStyles.webview}
                                    source={{ uri: getYouTubeEmbedUrl(recipe.youtubeUrl) }} // supply the transformed YouTube embed URL to the WebView for playback
                                    allowsFullscreenVideo // enable fullscreen support for the embedded video
                                    mediaPlaybackRequiresUserAction={false} // allow autoplay without requiring user interaction
                                />
                            </View>
                        </View>
                    )}

                    <View style={recipeDetailStyles.sectionContainer}>
                        <View style={recipeDetailStyles.sectionTitleRow}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primary + "80"]}
                                style={recipeDetailStyles.sectionIcon}
                            >
                                <Ionicons name="list" size={16} color={COLORS.white} />
                            </LinearGradient>

                            <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>

                            <View style={recipeDetailStyles.countBadge}>
                                <Text style={recipeDetailStyles.countText}>
                                    {recipe.ingredients.length} {/* render the total number of parsed ingredients for this recipe */}
                                </Text>
                            </View>
                        </View>

                        <View style={recipeDetailStyles.ingredientsGrid}>
                            {recipe.ingredients.map((ingredient, index) => ( // iterate over the parsed ingredients array to render each ingredient as a card
                                <View key={index} style={recipeDetailStyles.ingredientCard}>
                                    <View style={recipeDetailStyles.ingredientNumber}>
                                        <Text style={recipeDetailStyles.ingredientNumberText}>
                                            {index + 1} {/* display the 1-based ingredient index for ordering */}
                                        </Text>
                                    </View>

                                    <Text style={recipeDetailStyles.ingredientText}>
                                        {ingredient} {/* render the combined measure–ingredient string */}
                                    </Text>

                                    <View style={recipeDetailStyles.ingredientCheck}>
                                        <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textLight} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={recipeDetailStyles.sectionContainer}>
                        <View style={recipeDetailStyles.sectionTitleRow}>
                            <LinearGradient
                                colors={["#9C27B0", "#673AB7"]}
                                style={recipeDetailStyles.sectionIcon}
                            >
                                <Ionicons name="book" size={16} color={COLORS.white} />
                            </LinearGradient>

                            <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>

                            <View style={recipeDetailStyles.countBadge}>
                                <Text style={recipeDetailStyles.countText}>
                                    {recipe.instructions.length} {/* display the total number of instruction steps parsed from the recipe */}
                                </Text>
                            </View>
                        </View>

                        <View style={recipeDetailStyles.instructionsContainer}>
                            {recipe.instructions.map((instruction, index) => ( // iterate over each parsed instruction step to render a structured step card
                                <View key={index} style={recipeDetailStyles.instructionCard}>
                                    <LinearGradient
                                        colors={[COLORS.primary, COLORS.primary + "CC"]}
                                        style={recipeDetailStyles.stepIndicator}
                                    >
                                        <Text style={recipeDetailStyles.stepNumber}>
                                            {index + 1} {/* render the numeric step index for user guidance */}
                                        </Text>
                                    </LinearGradient>

                                    <View style={recipeDetailStyles.instructionContent}>
                                        <Text style={recipeDetailStyles.instructionText}>
                                            {instruction} {/* display the actual instruction text for this step */}
                                        </Text>

                                        <View style={recipeDetailStyles.instructionFooter}>
                                            <Text style={recipeDetailStyles.stepLabel}>
                                                Step {index + 1} {/* show a step label for additional clarity */}
                                            </Text>

                                            <TouchableOpacity style={recipeDetailStyles.completeButton}>
                                                <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={recipeDetailStyles.primaryButton}
                        onPress={handleToggleSave} // trigger saving or removing the recipe when pressed
                        disabled={isSaving} // prevent additional presses while the save/remove operation is in progress
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primary + "CC"]}
                            style={recipeDetailStyles.buttonGradient}
                        >
                            <Ionicons name="heart" size={20} color={COLORS.white} />

                            <Text style={recipeDetailStyles.buttonText}>
                                {isSaved ? "Remove from Favorites" : "Add to Favorites"} {/* dynamically render the button label based on saved state */}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default RecipeDetailScreen;