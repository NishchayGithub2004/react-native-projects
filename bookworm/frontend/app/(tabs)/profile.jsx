import { useEffect, useState } from "react"; // import useEffect to run side effects and useState to manage component-level reactive state

import {
    View, // import View to render a container in the native layout tree
    Alert, // import Alert to display system-style alert dialogs
    Text, // import Text to render textual UI elements
    FlatList, // import FlatList to efficiently render large scrollable lists
    TouchableOpacity, // import TouchableOpacity to create pressable UI elements with opacity feedback
    ActivityIndicator, // import ActivityIndicator to display a loading spinner
    RefreshControl, // import RefreshControl to add pull-to-refresh behavior to scrollable components
} from "react-native";

import { useRouter } from "expo-router"; // import useRouter to programmatically navigate between screens
import { API_URL } from "../../constants/api"; // import API_URL to reference the backend endpoint base URL
import { useAuthStore } from "../../store/authStore"; // import useAuthStore to access authentication state and actions
import styles from "../../assets/styles/profile.styles"; // import styles object to apply predefined profile-specific styles
import ProfileHeader from "../../components/ProfileHeader"; // import ProfileHeader component to render the user's profile header section
import LogoutButton from "../../components/LogoutButton"; // import LogoutButton component to trigger user logout actions
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to display vector-based icons in the UI
import COLORS from "../../constants/colors"; // import COLORS to use consistent color tokens across the UI
import { Image } from "expo-image"; // import Image to efficiently render remote or local images
import { sleep } from "."; // import sleep utility to introduce artificial delays for async flows
import Loader from "../../components/Loader"; // import Loader component to display a centralized loading indicator

export default function Profile() { // define the Profile functional component that serves as the user's profile screen
    const [books, setBooks] = useState([]); // initialize books array state to store the user's fetched books
    const [isLoading, setIsLoading] = useState(true); // initialize loading flag to control initial and background loading states
    const [refreshing, setRefreshing] = useState(false); // initialize refreshing flag to manage pull-to-refresh visual state
    const [deleteBookId, setDeleteBookId] = useState(null); // initialize deleteBookId to track which book is pending deletion

    const { token } = useAuthStore(); // extract token from auth store to authenticate API requests

    const router = useRouter(); // instantiate router to enable navigational actions within the app

    const fetchData = async () => { // define async fetchData to retrieve user-specific books from backend
        try {
            setIsLoading(true); // update loading flag to indicate active data retrieval

            const response = await fetch(`${API_URL}/books/user`, { // perform network request to fetch books for the authenticated user
                headers: { Authorization: `Bearer ${token}` }, // include bearer token to authorize the request
            });

            const data = await response.json(); // parse JSON body of the API response

            if (!response.ok) throw new Error(data.message || "Failed to fetch user books"); // throw error when response indicates failure to enforce uniform error handling

            setBooks(data); // update books state with successfully retrieved user books
        } catch (error) {
            console.error("Error fetching data:", error); // log error details for debugging
            Alert.alert("Error", "Failed to load profile data. Pull down to refresh."); // display alert to inform the user of loading failure
        } finally {
            setIsLoading(false); // ensure loading flag is cleared after success or failure
        }
    };

    useEffect(() => { // register effect to run on mount for initial data loading
        fetchData(); // invoke fetchData to retrieve profile books when component first renders
    }, []); // pass empty dependency array to ensure effect runs only once

    const handleDeleteBook = async (bookId) => { // define async function to delete a specific book identified by bookId
        try {
            setDeleteBookId(bookId); // update state to indicate which book is currently being deleted for UI feedback

            const response = await fetch(`${API_URL}/books/${bookId}`, { // issue DELETE request to backend to remove the target book
                method: "DELETE", // specify HTTP method to instruct server to delete the resource
                headers: { Authorization: `Bearer ${token}` }, // attach auth token to authorize the delete operation
            });

            const data = await response.json(); // parse JSON payload returned by server

            if (!response.ok) throw new Error(data.message || "Failed to delete book"); // raise error when server indicates failure

            setBooks(books.filter((book) => book._id !== bookId)); // update books state by removing the deleted book from list

            Alert.alert("Success", "Recommendation deleted successfully"); // notify user that deletion was successfully completed
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete recommendation"); // notify user when deletion operation fails
        } finally {
            setDeleteBookId(null); // reset deletion state to allow further delete operations
        }
    };

    const confirmDelete = (bookId) => { // define function to prompt user for confirmation before deletion
        Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation?", [ // display confirmation dialog
            { text: "Cancel", style: "cancel" }, // provide cancel option to abort the delete flow
            { text: "Delete", style: "destructive", onPress: () => handleDeleteBook(bookId) }, // provide delete option that triggers deletion logic
        ]);
    };

    const renderBookItem = ({ item }) => { // define renderBookItem to render a single book entry passed as item
        return (
            <View style={styles.bookItem}>
                <Image source={item.image} style={styles.bookImage} /> {/* render book image using item's image reference */}

                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{item.title}</Text> {/* render the book title sourced from item */}
                    <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View> {/* render dynamic rating stars based on item.rating */}
                    <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text> {/* display caption while limiting to two lines */}
                    <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text> {/* format and render the created date */}
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDelete(item._id)} // trigger deletion confirmation for this specific book ID
                >
                    {deleteBookId === item._id ? ( // check if this book is currently being deleted to conditionally show loader
                        <ActivityIndicator size="small" color={COLORS.primary} /> // show activity indicator while deletion is in progress
                    ) : (
                        <Ionicons name="trash-outline" size={20} color={COLORS.primary} /> // otherwise render trash icon for delete action
                    )}
                </TouchableOpacity>
            </View>
        )
    };

    const renderRatingStars = (rating) => { // define function to generate an array of star icons based on numeric rating
        const stars = []; // initialize array to accumulate rendered star icons

        for (let i = 1; i <= 5; i++) { // iterate through five fixed star positions
            stars.push( // append a star icon component into the stars array
                <Ionicons
                    key={i} // assign unique key to help React identify this icon instance
                    name={i <= rating ? "star" : "star-outline"} // choose filled or outlined star depending on comparison with rating
                    size={14} // set icon size
                    color={i <= rating ? "#f4b400" : COLORS.textSecondary} // apply highlight color for filled stars, secondary color otherwise
                    style={{ marginRight: 2 }} // apply spacing between sequential star icons
                />
            );
        }

        return stars; // return constructed icon array to be rendered by caller
    };

    const handleRefresh = async () => { // define async handler to perform pull-to-refresh logic
        setRefreshing(true); // set refreshing flag to trigger refresh indicator
        await sleep(500); // introduce short delay to avoid flickering and ensure visible refresh behavior
        await fetchData(); // re-fetch user's books from backend
        setRefreshing(false); // clear refreshing flag once refresh flow completes
    };

    if (isLoading && !refreshing) return <Loader />; // render Loader component when initial loading is active and not in a refresh state

    return (
        <View style={styles.container}>
            <ProfileHeader />

            <LogoutButton />

            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Recommendations 📚</Text>
                <Text style={styles.booksCount}>{books.length} books</Text> {/* render dynamic count of books */}
            </View>

            <FlatList
                data={books} // provide list data sourced from books state
                renderItem={renderBookItem} // supply renderer to produce UI for each book item
                keyExtractor={(item) => item._id} // extract stable unique key for list virtualization
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.booksList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // bind refresh indicator to refreshing state
                        onRefresh={handleRefresh} // trigger refresh handler when user pulls down
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendations yet</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/create")} // navigate user to creation screen for adding a new book
                        >
                            <Text style={styles.addButtonText}>Add Your First Book</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}