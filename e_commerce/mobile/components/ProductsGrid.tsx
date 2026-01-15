import useCart from "@/hooks/useCart"; // import custom hook 'useCart' to manage state of shopping cart
import useWishlist from "@/hooks/useWishlist"; // import custom hook 'useWishlist' to manage state of wishlist
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons"; // import 'Ionicons' from expo-vector-icons library to render icons
import { router } from "expo-router"; // import 'router' from expo-router library to navigate between screens
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
// from react native library, import 'View' component to render a container, 'Text' component to render text, 'FlatList' component to render a list of items, 
// 'TouchableOpacity' component to make a component touchable to do things on being touched, 'Image' component to render images, 'ActivityIndicator' component to render a loading spinner and 'Alert' component to render an alert dialog box

interface ProductsGridProps { // create an interface called 'ProductsGridProps' to define props for 'ProductsGrid' component
    // it includes 'isLoading' boolean state which is true if products are still being fetched, 'isError' boolean state which is true if there was an error fetching products, and 'products' array state which contains the fetched products as objects of type 'Product'
    isLoading: boolean;
    isError: boolean;
    products: Product[];
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => { // create a functional component called 'ProductsGrid' which takes properties of interface 'ProductsGridProps' in destructured form as argument
    const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlist();
    // from 'useWishlist' custom hook, destructure 'isInWishlist', 'toggleWishlist', 'isAddingToWishlist' and 'isRemovingFromWishlist' states and functions (purposes explained in code where they are defined)

    const { isAddingToCart, addToCart } = useCart(); // from 'useCart' custom hook, destructure 'isAddingToCart' and 'addToCart' states and functions (purposes explained in code where they are defined)

    const handleAddToCart = (productId: string, productName: string) => { // create a function called 'handleAddToCart' to add a product to cart
        // it takes product's unique ID and name as arguments in string form
        addToCart(
            { productId, quantity: 1 }, // add product to cart with product's unique ID and quantity as 1
            {
                onSuccess: () => {
                    Alert.alert("Success", `${productName} added to cart!`); // once the function executes successfully, display an alert with message that product was successfully added to cart
                },
                onError: (error: any) => { // if any error occurs while adding product to cart, display an alert with error message to know what error occured
                    Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                },
            }
        );
    };

    const renderProduct = ({ item: product }: { item: Product }) => (
        <TouchableOpacity
            className="bg-surface rounded-3xl overflow-hidden mb-3"
            style={{ width: "48%" }}
            activeOpacity={0.8}
            onPress={() => router.push(`/product/${product._id}`)} // pressing this component will redirect user to product's details page
        >
            <View className="relative">
                <Image
                    source={{ uri: product.images[0] }} // display the first image of the product
                    className="w-full h-44 bg-background-lighter"
                    resizeMode="cover"
                />

                <TouchableOpacity
                    className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
                    activeOpacity={0.7}
                    onPress={() => toggleWishlist(product._id)} // pressing this component will toggle the product's presence in wishlist
                    disabled={isAddingToWishlist || isRemovingFromWishlist} // if the product is being added or removed from wishlist, disable this component ie nothing will happen if it is clicked
                >
                    {isAddingToWishlist || isRemovingFromWishlist ? ( // while product is being added or removed from wishlist, display a loading spinner
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : ( // otherwise render an icon based on whether the product is in wishlist or not
                        // if product is in wishlist, display a filled heart icon with red color, otherwise display an outline heart icon
                        <Ionicons
                            name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                            size={18}
                            color={isInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"} // if product is in wishlist, display red color, otherwise display white color
                        />
                    )}
                </TouchableOpacity>
            </View>

            <View className="p-3">
                <Text className="text-text-secondary text-xs mb-1">{product.category}</Text> {/* render product category */}
                
                <Text className="text-text-primary font-bold text-sm mb-2" numberOfLines={2}>{product.name}</Text> {/* render product name */}

                <View className="flex-row items-center mb-2">
                    <Ionicons name="star" size={12} color="#FFC107" />
                    <Text className="text-text-primary text-xs font-semibold ml-1">{product.averageRating.toFixed(1)}</Text> {/* render average rating of product fixed to one decimal place */}
                    <Text className="text-text-secondary text-xs ml-1">({product.totalReviews})</Text> {/* render total number of reviews of product */}
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-primary font-bold text-lg">${product.price.toFixed(2)}</Text> {/* render product price fixed to two decimal places */}

                    <TouchableOpacity
                        className="bg-primary rounded-full w-8 h-8 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() => handleAddToCart(product._id, product.name)} // pressing this component will add product to cart by calling 'handleAddToCart' function with product's unique ID and name as arguments
                        disabled={isAddingToCart} // if product is being added to cart, disable this component ie nothing will happen if it is clicked
                    >
                        {isAddingToCart ? ( // if product is being added to cart, display a loading spinner, otherwise display an add icon */}
                            <ActivityIndicator size="small" color="#121212" />
                        ) : (
                            <Ionicons name="add" size={18} color="#121212" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) { // if products are still being fetched, display a loading spinner and message
        return (
            <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#00D9FF" />
                <Text className="text-text-secondary mt-4">Loading products...</Text>
            </View>
        );
    }

    if (isError) { // if there was an error fetching products, display an error message
        return (
            <View className="py-20 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
                <Text className="text-text-primary font-semibold mt-4">Failed to load products</Text>
                <Text className="text-text-secondary text-sm mt-2">Please try again later</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={NoProductsFound}
        />
    );
};

export default ProductsGrid;

function NoProductsFound() { // component to render when no products are found
    return (
        <View className="py-20 items-center justify-center">
            <Ionicons name="search-outline" size={48} color={"#666"} />
            <Text className="text-text-primary font-semibold mt-4">No products found</Text>
            <Text className="text-text-secondary text-sm mt-2">Try adjusting your filters</Text>
        </View>
    );
}