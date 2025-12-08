import {
    View, // import View to structure container layouts
    Text, // import Text to display textual content
    FlatList, // import FlatList for performant list rendering
    ActivityIndicator, // import ActivityIndicator to show loading indicators
    RefreshControl, // import RefreshControl to enable pull-to-refresh behavior
} from "react-native";

import { useAuthStore } from "../../store/authStore"; // import auth store hook to access authentication state
import { Image } from "expo-image"; // import Image for optimized image rendering
import { useEffect, useState } from "react"; // import React hooks for lifecycle management and state management
import styles from "../../assets/styles/home.styles"; // import stylesheet specific to home screen UI
import { API_URL } from "../../constants/api"; // import API_URL constant for backend endpoint references
import { Ionicons } from "@expo/vector-icons"; // import Ionicons to render vector-based icons
import { formatPublishDate } from "../../lib/utils"; // import utility to format book publish dates
import COLORS from "../../constants/colors"; // import color constants to enforce design consistency
import Loader from "../../components/Loader"; // import Loader component to display centralized loading UI

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // define sleep utility to create a promise that resolves after ms delay

export default function Home() { // define Home component that renders the main feed of books
    const { token } = useAuthStore(); // extract auth token to authenticate API requests
    const [books, setBooks] = useState([]); // manage array of books loaded from server
    const [loading, setLoading] = useState(true); // manage loading indicator for initial fetch
    const [refreshing, setRefreshing] = useState(false); // manage pull-to-refresh state
    const [page, setPage] = useState(1); // track the current pagination page number
    const [hasMore, setHasMore] = useState(true); // track whether additional pages are available for infinite scroll

    const fetchBooks = async (pageNum = 1, refresh = false) => { // define async fetchBooks to retrieve paginated results
        try {
            if (refresh) setRefreshing(true); // enable refreshing state during pull-to-refresh
            
            else if (pageNum === 1) setLoading(true); // enable loading only for initial page fetch

            const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=2`, { // request paginated list of books
                headers: { Authorization: `Bearer ${token}` }, // attach auth token for authorized access
            });

            const data = await response.json(); // parse server response as JSON
            
            if (!response.ok) throw new Error(data.message || "Failed to fetch books"); // propagate failure for non-OK responses
            
            const uniqueBooks =
                refresh || pageNum === 1 // rebuild book list when refreshing or loading first page
                    ? data.books
                    : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) =>
                        [...books, ...data.books].find((book) => book._id === id) // deduplicate merged book list by ID
                    );

            setBooks(uniqueBooks); // update state with deduplicated book list
            setHasMore(pageNum < data.totalPages); // determine if additional pages exist
            setPage(pageNum); // update current page reference
        } catch (error) {
            console.log("Error fetching books", error); // log fetch failures for debugging
        } finally {
            if (refresh) {
                await sleep(800); // delay to provide visible refresh UX
                setRefreshing(false); // disable refresh indicator after completion
            } else setLoading(false); // disable loading indicator for non-refresh fetch
        }
    };

    useEffect(() => { // run effect on initial component mount
        fetchBooks(); // load first page of books when component initializes
    }, []);

    const handleLoadMore = async () => { // define handler for infinite scroll pagination
        if (hasMore && !loading && !refreshing) { // prevent redundant fetch when already loading or no more pages
            await fetchBooks(page + 1); // fetch next page of results
        }
    };

    const renderItem = ({ item }) => { // define renderer to create UI for each book feed item
        return (
            <View style={styles.bookCard}>
                <View style={styles.bookHeader}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: item.user.profileImage }} style={styles.avatar} /> {/* render dynamic user profile image by URI */}
                        <Text style={styles.username}>{item.user.username}</Text> {/* render dynamic username of the book’s owner */}
                    </View>
                </View>

                <View style={styles.bookImageContainer}>
                    <Image source={item.image} style={styles.bookImage} contentFit="cover" /> {/* render book image with dynamic source */}
                </View>

                <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{item.title}</Text> {/* render dynamic book title */}
                    <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View> {/* render star rating based on item.rating */}
                    <Text style={styles.caption}>{item.caption}</Text> {/* render user-provided caption text */}
                    <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text> {/* dynamically format and display publish date */}
                </View>
            </View>
        )
    };

    const renderRatingStars = (rating) => {
        const stars = []; // initialize an empty array to store star icons
        
        for (let i = 1; i <= 5; i++) { // loop from 1 to 5 to render five star icons
            stars.push(
                <Ionicons
                    key={i} // assign a unique key for each icon to help React identify them
                    name={i <= rating ? "star" : "star-outline"} // choose filled or outline star based on rating value
                    size={16}
                    color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    style={{ marginRight: 2 }}
                />
            );
        }
        
        return stars; // return the array of star icons to be rendered in JSX
    };
    
    if (loading) return <Loader />; // if data is still loading and not refreshing, render a loader component    

    return (
        <View style={styles.container}>
            <FlatList
                data={books} // supply list data from books state
                renderItem={renderItem} // provide renderer for each book item
                keyExtractor={(item) => item._id} // use each book’s unique ID for stable key extraction
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // bind refresh indicator to refreshing state
                        onRefresh={() => fetchBooks(1, true)} // trigger refresh by re-fetching page 1 with refresh flag
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                onEndReached={handleLoadMore} // trigger pagination when user scrolls near end
                onEndReachedThreshold={0.1} // fire onEndReached when user reaches last 10% of list
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>BookWorm 🐛</Text>
                        <Text style={styles.headerSubtitle}>Discover great reads from the community👇</Text>
                    </View>
                }
                ListFooterComponent={
                    hasMore && books.length > 0 ? ( // show loader only when more pages exist and list is not empty
                        <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendations yet</Text>
                        <Text style={styles.emptySubtext}>Be the first to share a book!</Text>
                    </View>
                }
            />
        </View>
    );
}