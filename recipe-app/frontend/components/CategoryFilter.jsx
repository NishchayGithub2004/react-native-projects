import { View, Text, TouchableOpacity, ScrollView } from "react-native"; // import View to structure layout, Text to render labels, TouchableOpacity for pressable UI, ScrollView for horizontal scrolling
import { Image } from "expo-image"; // import Image to efficiently render remote images with caching and transitions
import { homeStyles } from "../assets/styles/home.styles"; // import homeStyles to apply predefined styling to category filter components

export default function CategoryFilter({ // define a functional component named CategoryFilter to render a horizontal list of selectable categories which takes following props
    categories, // list of category objects used to render filter items
    selectedCategory, // name of the currently selected category used to determine visual highlighting
    onSelectCategory // callback invoked when a user selects a category
}) {
    return (
        <View style={homeStyles.categoryFilterContainer}> 
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false} // hide scrollbar
                contentContainerStyle={homeStyles.categoryFilterScrollContent}
            >
                {categories.map((category) => { // iterate through categories to render a button for each category
                    const isSelected = selectedCategory === category.name; // compute whether this category is the currently selected one to determine styling
                    
                    return ( 
                        <TouchableOpacity
                            key={category.id} // ensure each rendered element has a stable identity
                            style={[homeStyles.categoryButton, isSelected && homeStyles.selectedCategory]} // apply active styling conditionally based on isSelected
                            onPress={() => onSelectCategory(category.name)} // invoke callback with category name so parent component updates selection logic
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{ uri: category.image }} // load image from of image URL pulled from category data
                                style={[homeStyles.categoryImage, isSelected && homeStyles.selectedCategoryImage]} // apply styles for selected image when image is selected
                                contentFit="cover"
                                transition={300}
                            />
                            
                            <Text
                                style={[homeStyles.categoryText, isSelected && homeStyles.selectedCategoryText]} // apply styles for selected text when text is selected
                            >
                                {category.name} {/* render the label of the category pulled from category data */}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}