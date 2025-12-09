import {
    View, // import View to structure layout containers for the screen
    Text, // import Text to render textual UI content
    Alert, // import Alert to display native alert dialogs to the user
    ScrollView, // import ScrollView to enable vertical scrolling of wrapped content
    TouchableOpacity, // import TouchableOpacity to create pressable interactive UI elements
    FlatList // import FlatList to efficiently render a virtualized scrolling list of items
} from "react-native";

import { useClerk, useUser } from "@clerk/clerk-expo"; // import useClerk to manage auth actions and useUser to access authenticated user data
import { useEffect, useState } from "react"; // import useEffect to handle lifecycle side effects and useState to manage component-local state variables
import { API_URL } from "../../constants/api"; // import API_URL to reference backend endpoint base URL for network requests
import { favoritesStyles } from "../../assets/styles/favorites.styles"; // import favoritesStyles to apply scoped styling to the favorites screen components
import { COLORS } from "../../constants/colors"; // import COLORS to use centralized color tokens across UI elements
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to render vector icons from the Ionicons library
import RecipeCard from "../../components/RecipeCard"; // import RecipeCard to render individual recipe information in card format
import NoFavoritesFound from "../../components/NoFavoritesFound"; // import NoFavoritesFound to display an empty-state component when no favorites exist
import LoadingSpinner from "../../components/LoadingSpinner"; // import LoadingSpinner to visually indicate loading states during async operations

const FavoritesScreen = () => { // define FavoritesScreen component to display user's saved favorite recipes
    const { signOut } = useClerk(); // extract signOut to allow the user to log out
    const { user } = useUser(); // extract authenticated user object to identify which user's favorites to load

    const [favoriteRecipes, setFavoriteRecipes] = useState([]); // create local state to store the transformed list of favorite recipes
    const [loading, setLoading] = useState(true); // create local state to track whether favorites are still being fetched

    useEffect(() => { // run side effect when user.id changes to fetch latest favorites
        const loadFavorites = async () => { // declare async function to fetch favorites from backend
            try { // attempt network fetch and data transformation
                const response = await fetch(`${API_URL}/favorites/${user.id}`); // issue GET request to retrieve favorites for the logged-in user

                if (!response.ok) throw new Error("Failed to fetch favorites"); // throw explicit error when backend response is unsuccessful

                const favorites = await response.json(); // parse JSON body containing raw favorites list

                const transformedFavorites = favorites.map((favorite) => ({ // transform backend favorites into UI-friendly structure
                    ...favorite, // spread original favorite properties as-is
                    id: favorite.recipeId, // override id field so FlatList can use recipeId uniquely
                }));

                setFavoriteRecipes(transformedFavorites); // update local state to render fetched favorites
            } catch (error) { // catch any client or network failures
                console.log("Error loading favorites", error); // log failure for debugging
                Alert.alert("Error", "Failed to load favorites"); // notify user that load operation failed
            } finally { // execute cleanup regardless of success or failure
                setLoading(false); // stop loading indicator once fetch has completed
            }
        };

        loadFavorites(); // invoke async loader immediately when effect runs
    }, [user.id]); // rerun effect only when the authenticated user's id changes

    const handleSignOut = () => { // define logout handler to confirm before signing out
        Alert.alert("Logout", "Are you sure you want to logout?", [ // display confirmation modal to reduce accidental logouts
            { text: "Cancel", style: "cancel" }, // provide cancel option to dismiss logout flow
            { text: "Logout", style: "destructive", onPress: signOut }, // call signOut only when user confirms destructive action
        ]);
    };

    if (loading) return <LoadingSpinner message="Loading your favorites..." />; // conditionally render loading spinner while favorites are being fetched

    return (
        <View style={favoritesStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={favoritesStyles.header}>
                    <Text style={favoritesStyles.title}>Favorites</Text>

                    <TouchableOpacity
                        style={favoritesStyles.logoutButton}
                        onPress={handleSignOut} // trigger logout confirmation workflow when the button is pressed
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={22}
                            color={COLORS.text}
                        />
                    </TouchableOpacity>
                </View>

                <View style={favoritesStyles.recipesSection}>
                    <FlatList
                        data={favoriteRecipes} // supply the transformed favorites array for rendering in the list
                        renderItem={({ item }) => <RecipeCard recipe={item} />} // render each favorite using RecipeCard and pass the recipe data
                        keyExtractor={(item) => item.id.toString()} // convert numeric id to string to ensure stable unique keys for list virtualization
                        numColumns={2} // instruct FlatList to render items in a two-column grid layout
                        columnWrapperStyle={favoritesStyles.row}
                        contentContainerStyle={favoritesStyles.recipesGrid}
                        scrollEnabled={false} // disable scrolling so outer ScrollView manages vertical scrolling
                        ListEmptyComponent={<NoFavoritesFound />} // display empty-state component when favorites list has zero items
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default FavoritesScreen;