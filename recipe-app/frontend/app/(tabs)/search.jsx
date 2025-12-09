import {
    View, // import View to structure layout containers for the screen
    Text, // import Text to render textual UI content
    TextInput, // import TextInput to capture user-entered search text
    TouchableOpacity, // import TouchableOpacity to create pressable interactive elements
    FlatList // import FlatList to efficiently render a scrollable list of recipe results
} from "react-native";

import { useEffect, useState } from "react"; // import useEffect and useState to manage component lifecycle and reactive state
import { MealAPI } from "../../services/mealAPI"; // import MealAPI to perform recipe search calls against the meal API service
import { useDebounce } from "../../hooks/useDebounce"; // import useDebounce to delay search execution while user is typing
import { searchStyles } from "../../assets/styles/search.styles"; // import searchStyles to apply consistent search UI styling
import { COLORS } from "../../constants/colors"; // import COLORS for shared color tokens across components
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to display icons within the search interface
import RecipeCard from "../../components/RecipeCard"; // import RecipeCard to render individual recipe items in the results list
import LoadingSpinner from "../../components/LoadingSpinner"; // import LoadingSpinner to show a loading indicator during fetch operations

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState(""); // store the user's search input
    const [recipes, setRecipes] = useState([]); // hold the list of recipes returned from the API
    const [loading, setLoading] = useState(false); // track whether a search request is currently running
    const [initialLoading, setInitialLoading] = useState(true); // track whether the initial data load is still in progress

    const debouncedSearchQuery = useDebounce(searchQuery, 300); // debounce user input to avoid excessive API calls

    const performSearch = async (query) => { // define a reusable search function that handles name and ingredient lookups
        if (!query.trim()) { // if query is empty, fetch random meals instead
            const randomMeals = await MealAPI.getRandomMeals(12); // request 12 random meals from the API

            return randomMeals
                .map((meal) => MealAPI.transformMealData(meal)) // normalize API data into internal format
                .filter((meal) => meal !== null); // filter out invalid transformations
        }

        const nameResults = await MealAPI.searchMealsByName(query); // attempt a name-based recipe search

        let results = nameResults;

        if (results.length === 0) { // fallback search by ingredient if name search returns no results
            const ingredientResults = await MealAPI.filterByIngredient(query); // search by ingredient
            results = ingredientResults;
        }

        return results
            .slice(0, 12) // limit result set to 12 items
            .map((meal) => MealAPI.transformMealData(meal)) // normalize result structure
            .filter((meal) => meal !== null); // remove any invalid entries
    };

    useEffect(() => {
        const loadInitialData = async () => { // define async initializer to populate screen on mount
            try {
                const results = await performSearch(""); // load random meals initially
                setRecipes(results); // update recipes list
            } catch (error) {
                console.error("Error loading initial data:", error); // log failure for debugging
            } finally {
                setInitialLoading(false); // mark initial load as finished
            }
        };

        loadInitialData(); // invoke initializer on component mount
    }, []);

    useEffect(() => {
        if (initialLoading) return; // prevent search logic from running before initial load completes

        const handleSearch = async () => { // run debounced search logic
            setLoading(true); // show loading indicator while searching

            try {
                const results = await performSearch(debouncedSearchQuery); // fetch recipes based on user query
                setRecipes(results); // update list with search results
            } catch (error) {
                console.error("Error searching:", error); // log error for debugging
                setRecipes([]); // clear list on failure
            } finally {
                setLoading(false); // end loading state
            }
        };

        handleSearch(); // trigger search
    }, [debouncedSearchQuery, initialLoading]); // trigger search whenever debouncedSearchQuery or loading state changes

    if (initialLoading) return <LoadingSpinner message="Loading recipes..." />; // show loading spinner while initial data is fetched

    return (
        <View style={searchStyles.container}>
            <View style={searchStyles.searchSection}>
                <View style={searchStyles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={COLORS.textLight}
                        style={searchStyles.searchIcon}
                    />

                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder="Search recipes, ingredients..."
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery} // bind the current search query to the input field
                        onChangeText={setSearchQuery} // update search query state whenever the user types
                        returnKeyType="search"
                    />

                    {searchQuery.length > 0 && ( // conditionally show a clear button only when text exists
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")} // clear the search input when pressed
                            style={searchStyles.clearButton}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={searchStyles.resultsSection}>
                <View style={searchStyles.resultsHeader}>
                    <Text style={searchStyles.resultsTitle}>
                        {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"} {/* dynamically choose title based on whether a search query exists */}
                    </Text>

                    <Text style={searchStyles.resultsCount}>
                        {recipes.length} found {/* display the number of recipes returned from the search or initial load */}
                    </Text>
                </View>

                {loading ? ( // conditionally render a loader when a search request is in progress
                    <View style={searchStyles.loadingContainer}>
                        <LoadingSpinner
                            message="Searching recipes..." // show user feedback specific to ongoing search
                            size="small"
                        />
                    </View>
                ) : (
                    <FlatList
                        data={recipes} // supply the list of transformed recipe results
                        renderItem={({ item }) => <RecipeCard recipe={item} />} // render each recipe using the RecipeCard component
                        keyExtractor={(item) => item.id.toString()} // provide unique id in string form as a stable unique key for each rendered item
                        numColumns={2} // display recipes in a two-column grid
                        columnWrapperStyle={searchStyles.row}
                        contentContainerStyle={searchStyles.recipesGrid}
                        showsVerticalScrollIndicator={false} // hide vertical scroll indicator
                        ListEmptyComponent={<NoResultsFound />} // render fallback UI when there are no search results
                    />
                )}
            </View>
        </View>
    );
};

export default SearchScreen;

function NoResultsFound() {
    return (
        <View style={searchStyles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.textLight} />

            <Text style={searchStyles.emptyTitle}>No recipes found</Text>

            <Text style={searchStyles.emptyDescription}>
                Try adjusting your search or try different keywords
            </Text>
        </View>
    );
}