import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart"; // import custom hook 'useCart' to manage user's cart
import { useProduct } from "@/hooks/useProduct"; // import custom hook 'useProduct' to fetch product details
import useWishlist from "@/hooks/useWishlist"; // import custom hook 'useWishlist' to manage user's wishlist
import { Ionicons } from "@expo/vector-icons"; // from expo-vector-icons library, import 'Ionicons' to render icons
import { Image } from "expo-image"; // from expo-image library, import 'Image' to render images
import { router, useLocalSearchParams } from "expo-router"; // from expo-router library, import 'router' to navigate between screens and 'useLocalSearchParams' to get search parameters from the URL
import { useState } from "react"; // import 'useState' hook to create and manage variables in functional components
import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from "react-native";
// from react-native library, import 'View' to render a container, 'Text' to render text, 'Image' to render images, 'TouchableOpacity' to make elements clickable, and 'ActivityIndicator' to show loading spinner

const { width } = Dimensions.get("window"); // get width of the screen the app is running on

const ProductDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>(); // get the product's unique ID from the URL
    
    const { data: product, isError, isLoading } = useProduct(id); // pass the unique ID to the custom hook 'useProduct' to fetch the product's details and 'isError' and 'isLoading' states
    
    const { addToCart, isAddingToCart } = useCart(); // from custom hook 'useCart', extract 'addToCart' function to add items to cart and 'isAddingToCart' state to track if an item is being added to cart

    const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlist();
    // from 'useWishlist' hook, extract 'isInWishlist', 'toggleWishlist', 'isAddingToWishlist', and 'isRemovingFromWishlist' functions and states (purposes explained in files the custom hook was created in)

    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // local variable to track the index of the currently selected image (initialized as 0) with function to update it's value
    
    const [quantity, setQuantity] = useState(1); // local variable to track the quantity of the product (initialized as 1) with function to update it's value

    const handleAddToCart = () => { // create a function named 'handleAddToCart' to add the product to the cart
        if (!product) return; // if product does not exist, do nothing
        
        addToCart( // otherwise call 'addToCart' function to add product to cart
            { productId: product._id, quantity }, // it takes product's unique ID and quantity of products as arguments
            {
                onSuccess: () => Alert.alert("Success", `${product.name} added to cart!`), // when items are added to the cart, an alert message is rendered that product has been added to the cart
                onError: (error: any) => { // if any error occurs, an alert message is rendered that product has failed to be added to the cart with what error occured (if available)
                    Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                },
            }
        );
    };

    if (isLoading) return <LoadingUI />; // if 'isLoading' state is true, render 'LoadingUI' component
    
    if (isError || !product) return <ErrorUI />; // if 'isError' state is true ie some error occured or product does not exist, render 'ErrorUI' component

    const inStock = product.stock > 0; // check if product is in stock ie if it's quantity in stock is greater than 0

    return (
        <SafeScreen>
            <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between">
                <TouchableOpacity
                    className="bg-black/50 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center"
                    onPress={() => router.back()} // pressing this component takes user to previous page/screen
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    className={`w-12 h-12 rounded-full items-center justify-center ${isInWishlist(product._id) ? "bg-primary" : "bg-black/50 backdrop-blur-xl"}`}
                    onPress={() => toggleWishlist(product._id)} // pressing this component calls 'toggleWishlist' function with product's unique ID as argument
                    disabled={isAddingToWishlist || isRemovingFromWishlist} // if value of 'isAddingToWishlist' or 'isRemovingFromWishlist' is true, component is disabled ie touching it does nothing
                    activeOpacity={0.7}
                >
                    {isAddingToWishlist || isRemovingFromWishlist ? ( // if value of 'isAddingToWishlist' or 'isRemovingFromWishlist' is true, render a loading spinner
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons
                            name={isInWishlist(product._id) ? "heart" : "heart-outline"} // if product is in wishlist, render a filled heart icon, otherwise render an outline heart icon
                            size={24}
                            color={isInWishlist(product._id) ? "#121212" : "#FFFFFF"} // if product is in wishlist, text color is black, otherwise text color is white
                        />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="relative">
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false} // don't show horizontal scroll indicator for this component
                        onScroll={(e) => { // when this component is scrolled
                            const index = Math.round(e.nativeEvent.contentOffset.x / width); // calculate index of currently selected image by dividing the horizontal scroll offset by the width of the screen
                            setSelectedImageIndex(index); // set value of 'selectedImageIndex' to index of currently selected image
                        }}
                    >
                        {product.images.map((image: string, index: number) => ( // iterate over product's 'images' array with image's URL as string and it's index in number form
                            <View key={index} style={{ width }}> {/* container of image has it's index as unique identifier */}
                                <Image source={image} style={{ width, height: 400 }} contentFit="cover" /> {/* render current image */}
                            </View>
                        ))}
                    </ScrollView>

                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                        {product.images.map((_: any, index: number) => ( // iterate over product's 'images' array with index in number form
                            <View
                                key={index} // container of image has it's index as unique identifier
                                className={`h-2 rounded-full ${index === selectedImageIndex ? "bg-primary w-6" : "bg-white/50 w-2"}`}
                                // if value of 'index' is same as value of 'selectedImageIndex', render a larger container with green background color, otherwise render a smaller container with white background color
                            />
                        ))}
                    </View>
                </View>

                <View className="p-6">
                    <View className="flex-row items-center mb-3">
                        <View className="bg-primary/20 px-3 py-1 rounded-full">
                            <Text className="text-primary text-xs font-bold">{product.category}</Text> {/* render product's category */}
                        </View>
                    </View>

                    <Text className="text-text-primary text-3xl font-bold mb-3">{product.name}</Text> {/* render product's name */}

                    <View className="flex-row items-center mb-4">
                        <View className="flex-row items-center bg-surface px-3 py-2 rounded-full">
                            <Ionicons name="star" size={16} color="#FFC107" />
                            <Text className="text-text-primary font-bold ml-1 mr-2">{product.averageRating.toFixed(1)}</Text> {/* render product's average rating */}
                            <Text className="text-text-secondary text-sm">({product.totalReviews} reviews)</Text> {/* render product's total number of reviews */}
                        </View>

                        {inStock ? ( // if product is in stock, render the quantity of product in stock, otherwise render a message saying product is out of stock
                            <View className="ml-3 flex-row items-center">
                                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                <Text className="text-green-500 font-semibold text-sm">{product.stock} in stock</Text>
                            </View>
                        ) : (
                            <View className="ml-3 flex-row items-center">
                                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                <Text className="text-red-500 font-semibold text-sm">Out of Stock</Text>
                            </View>
                        )}
                    </View>

                    <View className="flex-row items-center mb-6">
                        <Text className="text-primary text-4xl font-bold">${product.price.toFixed(2)}</Text> {/* render product's price */}
                    </View>

                    <View className="mb-6">
                        <Text className="text-text-primary text-lg font-bold mb-3">Quantity</Text>

                        <View className="flex-row items-center">
                            <TouchableOpacity
                                className="bg-surface rounded-full w-12 h-12 items-center justify-center"
                                onPress={() => setQuantity(Math.max(1, quantity - 1))} // pressing this component calls 'setQuantity' function with maximum of 1 or current quantity minus 1 as argument
                                activeOpacity={0.7}
                                disabled={!inStock} // if product is not in stock, component is disabled ie touching it does nothing
                            >
                                <Ionicons name="remove" size={24} color={inStock ? "#FFFFFF" : "#666"} /> {/* color of remove icon depends on whether the component is in stock or not */}
                            </TouchableOpacity>

                            <Text className="text-text-primary text-xl font-bold mx-6">{quantity}</Text> {/* render quantity of product */}

                            <TouchableOpacity
                                className="bg-primary rounded-full w-12 h-12 items-center justify-center"
                                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))} // pressing this component calls 'setQuantity' function with minimum of product's stock or current quantity plus 1 as argument
                                activeOpacity={0.7}
                                disabled={!inStock || quantity >= product.stock} // if product is not in stock or quantity is greater than or equal to quantity in stock, component is disabled ie touching it does nothing
                            >
                                <Ionicons
                                    name="add"
                                    size={24}
                                    color={!inStock || quantity >= product.stock ? "#666" : "#121212"} // color of add icon depends on whether the component is in stock or not or it's quantity is greater than or equal to quantity in stock
                                />
                            </TouchableOpacity>
                        </View>

                        {quantity >= product.stock && inStock && ( // if current product is in stock and quantity is greater than or equal to quantity in stock, render a message saying maximum stock reached)
                            <Text className="text-orange-500 text-sm mt-2">Maximum stock reached</Text>
                        )}
                    </View>

                    <View className="mb-8">
                        <Text className="text-text-primary text-lg font-bold mb-3">Description</Text>
                        <Text className="text-text-secondary text-base leading-6">{product.description}</Text> {/* render product's description */}
                    </View>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface px-6 py-4 pb-8">
                <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                        <Text className="text-text-secondary text-sm mb-1">Total Price</Text>
                        <Text className="text-primary text-2xl font-bold">${(product.price * quantity).toFixed(2)}</Text> {/* render total price of product (price of one product multipied by quantity) fixed to 2 decimal places */}
                    </View>
                    
                    <TouchableOpacity
                        className={`rounded-2xl px-8 py-4 flex-row items-center ${!inStock ? "bg-surface" : "bg-primary"}`} // apply color based on whether product is in stock or not
                        activeOpacity={0.8}
                        onPress={handleAddToCart} // pressing this component calls 'handleAddToCart' function
                        disabled={!inStock || isAddingToCart} // if product is not in stock or 'isAddingToCart' state is true ie product is being added to cart, component is disabled ie touching it does nothing
                    >
                        {isAddingToCart ? ( // if 'isAddingToCart' state is true ie product is being added to cart, render a loading spinner
                            <ActivityIndicator size="small" color="#121212" />
                        ) : (
                            <>
                                <Ionicons name="cart" size={24} color={!inStock ? "#666" : "#121212"} /> {/* color of icon depends on whether the item is in stock or not */}
                                <Text
                                    className={`font-bold text-lg ml-2 ${!inStock ? "text-text-secondary" : "text-background"}`}
                                >
                                    {!inStock ? "Out of Stock" : "Add to Cart"} {/* render text based on whether the product is in stock or not */}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
};

export default ProductDetailScreen;

function ErrorUI() {
    return (
        <SafeScreen>
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                
                <Text className="text-text-primary font-semibold text-xl mt-4">Product not found</Text>
                
                <Text className="text-text-secondary text-center mt-2">This product may have been removed or doesn&apos;t exist</Text>
                
                <TouchableOpacity
                    className="bg-primary rounded-2xl px-6 py-3 mt-6"
                    onPress={() => router.back()} // pressing this component takes user to previous page/screen
                >
                    <Text className="text-background font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        </SafeScreen>
    );
}

function LoadingUI() {
    return (
        <SafeScreen>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1DB954" />
                <Text className="text-text-secondary mt-4">Loading product...</Text>
            </View>
        </SafeScreen>
    );
}