import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts"; // import custom hook 'useProducts' to fetch products data from backend
import { Ionicons } from "@expo/vector-icons"; // from expo-vector-icons library, import 'Ionicons' component to render icons
import { useMemo, useState } from "react"; // import 'useState' hook to manage state variables and 'useMemo' hook to remember calculated values
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";

const CATEGORIES = [ // create an array of objects where each object represents a category with name and image
    { name: "All", icon: "grid-outline" as const },
    { name: "Electronics", image: require("@/assets/images/electronics.png") },
    { name: "Fashion", image: require("@/assets/images/fashion.png") },
    { name: "Sports", image: require("@/assets/images/sports.png") },
    { name: "Books", image: require("@/assets/images/books.png") },
];

const ShopScreen = () => {
    const [searchQuery, setSearchQuery] = useState(""); // create a variable 'searchQuery' and set its initial value to an empty string and a function 'setSearchQuery' to update it's value
    
    const [selectedCategory, setSelectedCategory] = useState("All"); // create a variable 'selectedCategory' and set its initial value to "All" and a function'setSelectedCategory' to update it's value

    const { data: products, isLoading, isError } = useProducts(); // extract 'data' state as name 'products', 'isLoading' and 'isError' state from custom hook 'useProducts'

    const filteredProducts = useMemo(() => { // create an instance of 'useMemo' hook to remember the filtered products based on the selected category and search query
        if (!products) return []; // if 'products' state is null, return an empty array

        let filtered = products; // create a variable 'filtered' to store filtered products, initially assign all products to it since initially no filter is applied

        if (selectedCategory !== "All") filtered = filtered.filter((product) => product.category === selectedCategory);
        // if selected category is not "All", filter products based on the selected category

        // if search query is not empty, filter products based on the search query by converting both product name and search query to lowercase and checking if the search query is included in the product name
        if (searchQuery.trim()) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered; // return the filtered products found
    }, [products, selectedCategory, searchQuery]); // when products, selected category, or search query changes, recalculate the filtered products and remember them

    return (
        <SafeScreen>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 pb-4 pt-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-text-primary text-3xl font-bold tracking-tight">Shop</Text>
                            <Text className="text-text-secondary text-sm mt-1">Browse all products</Text>
                        </View>

                        <TouchableOpacity className="bg-surface/50 p-3 rounded-full" activeOpacity={0.7}>
                            <Ionicons name="options-outline" size={22} color={"#fff"} />
                        </TouchableOpacity>
                    </View>

                    <View className="bg-surface flex-row items-center px-5 py-4 rounded-2xl">
                        <Ionicons color={"#666"} size={22} name="search" />
                        <TextInput
                            placeholder="Search for products"
                            placeholderTextColor={"#666"}
                            className="flex-1 ml-3 text-base text-text-primary"
                            value={searchQuery} // search query is the value of this input field
                            onChangeText={setSearchQuery} // when the value of this input field changes, update the search query by calling 'setSearchQuery' function
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {CATEGORIES.map((category) => { // iterate over each category in the CATEGORIES array
                            const isSelected = selectedCategory === category.name; // check if current category is selected by comparing it with the selected category
                            
                            return (
                                <TouchableOpacity
                                    key={category.name} // category name is the unique identity of this component
                                    onPress={() => setSelectedCategory(category.name)} // pressing this component will update the selected category by calling 'setSelectedCategory' function for current category
                                    className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`} // apply styles based on whether current category is the selected one or not
                                >
                                    {category.icon ? ( // if category has an icon, render it using 'Ionicons' components, otherwise render the category image, color of icon depends on whether current category is selected or not
                                        <Ionicons
                                            name={category.icon}
                                            size={36}
                                            color={isSelected ? "#121212" : "#fff"}
                                        />
                                    ) : (
                                        <Image source={category.image} className="size-12" resizeMode="contain" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View className="px-6 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-primary text-lg font-bold">Products</Text>
                        <Text className="text-text-secondary text-sm">{filteredProducts.length} items</Text> {/* render the number of filtered products found */}
                    </View>

                    <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
                </View>
            </ScrollView>
        </SafeScreen>
    );
};

export default ShopScreen;