import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function WishlistScreen() {
    const { wishlist, isLoading, isError, removeFromWishlist, isRemovingFromWishlist } = useWishlist();
    // from custom hook 'useWishlist', extract 'wishlist', 'isLoading', 'isError', 'removeFromWishlist', and 'isRemovingFromWishlist' states and functions
    // (purposes explained in the file they were created in)

    const { addToCart, isAddingToCart } = useCart(); // from custom hook 'useCart', extract 'addToCart' and 'isAddingToCart' states and functions
    // (purposes explained in the file they were created in)

    const handleRemoveFromWishlist = (productId: string, productName: string) => { // create a function named 'handleRemoveFromWishlist' that takes product's unique ID and name as arguments
        // show an alert dialog to confirm the removal of the product from the wishlist
        Alert.alert("Remove from wishlist", `Remove ${productName} from wishlist`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",

                onPress: () => removeFromWishlist(productId), // pressing the 'OK' button will trigger the 'removeFromWishlist' function with the given product ID as an argument
            },
        ]);
    };

    const handleAddToCart = (productId: string, productName: string) => { // create a function named 'handleAddToCart' that takes product's unique ID and name as arguments
        addToCart( // call 'addToCart' function with product's unique ID and quantity set to 1
            { productId, quantity: 1 },
            {
                onSuccess: () => Alert.alert("Success", `${productName} added to cart!`), // when the product is successfully added to the cart, show an alert dialog that product was added to cart
                onError: (error: any) => { // if any error occurs during the addition process, show an alert dialog with the error message (if available)
                    Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                },
            }
        );
    };

    if (isLoading) return <LoadingUI />; // if 'isLoading' state is true, render the 'LoadingUI' component
    
    if (isError) return <ErrorUI />; // if 'isError' state is true, render the 'ErrorUI' component

    return (
        <SafeScreen>
            <View className="px-6 pb-5 border-b border-surface flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4"> {/* pressing this component takes user to previous page */}
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
                
                <Text className="text-text-secondary text-sm ml-auto">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</Text>
            </View>

            {wishlist.length === 0 ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="heart-outline" size={80} color="#666" />
                    
                    <Text className="text-text-primary font-semibold text-xl mt-4">
                        Your wishlist is empty
                    </Text>
                    
                    <Text className="text-text-secondary text-center mt-2">
                        Start adding products you love!
                    </Text>
                    
                    <TouchableOpacity
                        className="bg-primary rounded-2xl px-8 py-4 mt-6"
                        activeOpacity={0.8}
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Text className="text-background font-bold text-base">Browse Products</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View className="px-6 py-4">
                        {wishlist.map((item) => ( // iterate over 'wishlist' array as 'item'
                            <TouchableOpacity
                                key={item._id} // unique ID of current item is unique ID of this component
                                className="bg-surface rounded-3xl overflow-hidden mb-3"
                                activeOpacity={0.8}
                            >
                                <View className="flex-row p-4">
                                    <Image
                                        source={item.images[0]} // render first image of current item's images array
                                        className="rounded-2xl bg-background-lighter"
                                        style={{ width: 96, height: 96, borderRadius: 8 }}
                                    />

                                    <View className="flex-1 ml-4">
                                        {/* render item's name and price (fixed to 2 decimal places) */}
                                        <Text className="text-text-primary font-bold text-base mb-2" numberOfLines={2}>{item.name}</Text>
                                        <Text className="text-primary font-bold text-xl mb-2">${item.price.toFixed(2)}</Text>

                                        {item.stock > 0 ? ( // if item is in stock, render it's quantity in stock, otherwise, write 'Out of Stock'
                                            <View className="flex-row items-center">
                                                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                                <Text className="text-green-500 text-sm font-semibold">
                                                    {item.stock} in stock
                                                </Text>
                                            </View>
                                        ) : (
                                            <View className="flex-row items-center">
                                                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                                <Text className="text-red-500 text-sm font-semibold">Out of Stock</Text>
                                            </View>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        className="self-start bg-red-500/20 p-2 rounded-full"
                                        activeOpacity={0.7}
                                        onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                                        // pressing this component calls 'handleRemoveFromWishlist' function with current item's unique ID and name as arguments
                                        disabled={isRemovingFromWishlist} // disable this component if 'isRemovingFromWishlist' state is true ie item is being removed from wishlist
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                                
                                {item.stock > 0 && (
                                    <View className="px-4 pb-4">
                                        <TouchableOpacity
                                            className="bg-primary rounded-xl py-3 items-center"
                                            activeOpacity={0.8}
                                            onPress={() => handleAddToCart(item._id, item.name)}
                                            // pressing this component calls 'handleAddToCart' function with current item's unique ID and name as arguments
                                            disabled={isAddingToCart} // disable this component if 'isAddingToCart' state is true ie item is being added to cart
                                        >
                                            {isAddingToCart ? ( // if value of 'isAddingToCart' state is true, render a loading spinner, otherwise, render 'Add to Cart' text
                                                <ActivityIndicator size="small" color="#121212" />
                                            ) : (
                                                <Text className="text-background font-bold">Add to Cart</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeScreen>
    );
}

export default WishlistScreen;

function LoadingUI() {
    return (
        <SafeScreen>
            <View className="px-6 pb-5 border-b border-surface flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4"> {/* pressing this component takes user to previous page */}
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
            </View>
            
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#00D9FF" />
                <Text className="text-text-secondary mt-4">Loading wishlist...</Text>
            </View>
        </SafeScreen>
    );
}

function ErrorUI() {
    return (
        <SafeScreen>
            <View className="px-6 pb-5 border-b border-surface flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4"> {/* pressing this component takes user to previous page */}
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
            </View>
            
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                <Text className="text-text-primary font-semibold text-xl mt-4">Failed to load wishlist</Text>
                <Text className="text-text-secondary text-center mt-2">Please check your connection and try again</Text>
            </View>
        </SafeScreen>
    );
}