import {
    View, // import View to structure screen-level and nested layout containers
    Text, // import Text to render textual UI content
    ScrollView, // import ScrollView to enable vertically scrollable screen content
    TouchableOpacity, // import TouchableOpacity to create interactive pressable elements
    FlatList, // import FlatList to efficiently render large lists with virtualization
    RefreshControl // import RefreshControl to enable pull-to-refresh behavior on scrollable views
} from "react-native";

import { useEffect, useState } from "react"; // import useEffect for lifecycle side effects and useState for managing local state
import { useRouter } from "expo-router"; // import useRouter to navigate between application routes
import { MealAPI } from "../../services/mealAPI"; // import MealAPI to fetch recipe and category data from backend service
import { homeStyles } from "../../assets/styles/home.styles"; // import homeStyles to apply predefined styling for the home screen layout
import { Image } from "expo-image"; // import Image to render optimized images with caching and performance features
import { COLORS } from "../../constants/colors"; // import COLORS to reuse centralized theme color values across UI
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to display vector icons within UI components
import CategoryFilter from "../../components/CategoryFilter"; // import CategoryFilter to allow users to filter recipes by category
import RecipeCard from "../../components/RecipeCard"; // import RecipeCard to display individual recipe items in card format
import LoadingSpinner from "../../components/LoadingSpinner"; // import LoadingSpinner to visually indicate asynchronous loading states

const HomeScreen = () => { // define HomeScreen component responsible for loading and displaying recipes, categories, and featured content
    const router = useRouter(); // obtain router instance to navigate to other screens when user interacts with UI

    const [selectedCategory, setSelectedCategory] = useState(null); // track which recipe category is currently selected for filtering
    const [recipes, setRecipes] = useState([]); // store the list of fetched and transformed recipe objects
    const [categories, setCategories] = useState([]); // store all recipe categories fetched from the API
    const [featuredRecipe, setFeaturedRecipe] = useState(null); // store one highlighted recipe for featured display
    const [loading, setLoading] = useState(true); // indicate whether initial data fetching is in progress
    const [refreshing, setRefreshing] = useState(false); // indicate whether pull-to-refresh is currently active

    const loadData = async () => { // define async function to fetch categories, random meals, and a featured meal concurrently
        try { // wrap operations in try block to catch and handle failures
            setLoading(true); // enable loading indicator before network operations begin

            const [apiCategories, randomMeals, featuredMeal] = await Promise.all([ // concurrently execute multiple API calls for efficiency
                MealAPI.getCategories(), // fetch all available meal categories
                MealAPI.getRandomMeals(12), // fetch 12 random meals to populate initial grid
                MealAPI.getRandomMeal(), // fetch a single meal to display as featured
            ]);

            const transformedCategories = apiCategories.map((cat, index) => ({ // convert raw API category objects into UI-friendly format
                id: index + 1, // generate incremental numeric ID for category keys
                name: cat.strCategory, // extract category name for display and filtering
                image: cat.strCategoryThumb, // assign category thumbnail image
                description: cat.strCategoryDescription, // store category description for downstream detail usage
            }));

            setCategories(transformedCategories); // update categories state to render category filter UI

            if (!selectedCategory) setSelectedCategory(transformedCategories[0].name); // default category selection to first category when none selected

            const transformedMeals = randomMeals // shape random meals into display-ready objects
                .map((meal) => MealAPI.transformMealData(meal)) // normalize meal fields for UI consistency
                .filter((meal) => meal !== null); // omit meals that failed transformation or returned invalid data

            setRecipes(transformedMeals); // populate recipe grid with transformed random meals

            const transformedFeatured = MealAPI.transformMealData(featuredMeal); // standardize featured meal data structure

            setFeaturedRecipe(transformedFeatured); // update state to display featured recipe content
        } catch (error) { // handle API or transformation errors
            console.log("Error loading the data", error); // log error details for debugging
        } finally { // ensure cleanup happens regardless of success or failure
            setLoading(false); // disable loading indicator once operations conclude
        }
    };

    const loadCategoryData = async (category) => { // define async function to fetch and transform meals belonging to a specific category
        try { // attempt category-based fetch and transformation
            const meals = await MealAPI.filterByCategory(category); // fetch meals filtered by the selected category from the API

            const transformedMeals = meals // normalize and clean up the fetched meals
                .map((meal) => MealAPI.transformMealData(meal)) // convert raw API meal objects into UI-friendly structures
                .filter((meal) => meal !== null); // exclude meals that failed transformation or contain invalid data

            setRecipes(transformedMeals); // update recipe list to reflect meals from selected category
        } catch (error) { // catch failures from fetch or transformation
            console.error("Error loading category data:", error); // log error to console for diagnosis
            setRecipes([]); // clear recipe list to prevent stale UI content when category fetch fails
        }
    };

    const handleCategorySelect = async (category) => { // define handler for selecting a category from UI
        setSelectedCategory(category); // update currently selected category to drive UI state
        await loadCategoryData(category); // load meals for the newly selected category
    };

    const onRefresh = async () => { // define pull-to-refresh behavior for refreshing home screen data
        setRefreshing(true); // enable UI spinner indicating refresh is in progress
        await loadData(); // reload full dataset including categories, random meals, and featured meal
        setRefreshing(false); // disable refresh indicator after data reload completes
    };

    useEffect(() => { // run once on component mount to fetch initial dataset
        loadData(); // invoke primary loader to populate categories, recipes, and featured recipe
    }, []);

    if (loading && !refreshing) return <LoadingSpinner message="Loading delicions recipes..." />; // display spinner during initial load    

    return (
        <View style={homeStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ // inject pull-to-refresh controller into ScrollView for manual data refreshing
                    <RefreshControl
                        refreshing={refreshing} // bind current refresh state to control spinner visibility
                        onRefresh={onRefresh} // trigger full data reload when user performs pull-down gesture
                        tintColor={COLORS.primary}
                    />
                }
                contentContainerStyle={homeStyles.scrollContent}
            >
                <View style={homeStyles.welcomeSection}>
                    <Image
                        source={require("../../assets/images/lamb.png")}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />

                    <Image
                        source={require("../../assets/images/chicken.png")}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />

                    <Image
                        source={require("../../assets/images/pork.png")}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                </View>

                {featuredRecipe && (
                    <View style={homeStyles.featuredSection}>
                        <TouchableOpacity
                            style={homeStyles.featuredCard}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/recipe/${featuredRecipe.id}`)} // navigate to the detailed recipe screen using the featured recipe's id
                        >
                            <View style={homeStyles.featuredImageContainer}>
                                <Image
                                    source={{ uri: featuredRecipe.image }}
                                    style={homeStyles.featuredImage}
                                    contentFit="cover"
                                    transition={500}
                                />

                                <View style={homeStyles.featuredOverlay}>
                                    <View style={homeStyles.featuredBadge}>
                                        <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                                    </View>

                                    <View style={homeStyles.featuredContent}>
                                        <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                                            {featuredRecipe.title}
                                        </Text>

                                        <View style={homeStyles.featuredMeta}>
                                            <View style={homeStyles.metaItem}>
                                                <Ionicons name="time-outline" size={16} color={COLORS.white} />
                                                <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                                            </View>

                                            <View style={homeStyles.metaItem}>
                                                <Ionicons name="people-outline" size={16} color={COLORS.white} />
                                                <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                                            </View>

                                            {featuredRecipe.area && (
                                                <View style={homeStyles.metaItem}>
                                                    <Ionicons name="location-outline" size={16} color={COLORS.white} />
                                                    <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {categories.length > 0 && ( // render category filter only when categories have been successfully loaded
                    <CategoryFilter
                        categories={categories} // provide full category list for rendering selectable options
                        selectedCategory={selectedCategory} // indicate which category is currently active for highlighting and filtering
                        onSelectCategory={handleCategorySelect} // handle category change by updating state and loading related meals
                    />
                )}

                <View style={homeStyles.recipesSection}>
                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
                    </View>

                    {recipes.length > 0 ? ( // choose between rendering recipe grid or empty-state UI based on whether any recipes are available
                        <FlatList
                            data={recipes} // supply list of transformed recipes to be displayed in the grid
                            renderItem={({ item }) => <RecipeCard recipe={item} />} // render each recipe using RecipeCard with its data injected
                            keyExtractor={(item) => item.id.toString()} // ensure stable unique keys for FlatList virtualization by stringifying IDs
                            numColumns={2} // define two-column grid layout for recipe cards
                            columnWrapperStyle={homeStyles.row}
                            contentContainerStyle={homeStyles.recipesGrid}
                            scrollEnabled={false} // disable internal scrolling since parent ScrollView handles vertical scroll
                        />
                    ) : (
                        <View style={homeStyles.emptyState}>
                            <Ionicons
                                name="restaurant-outline"
                                size={64}
                                color={COLORS.textLight}
                            />
                            <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                            <Text style={homeStyles.emptyDescription}>Try a different category</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;