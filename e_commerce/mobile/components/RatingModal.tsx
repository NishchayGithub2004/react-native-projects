import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons"; // from expo-vector-icons, import Ionicons component to render icons
import { Image } from "expo-image"; // from expo-image, import Image component to render images
import { View, Text, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
// from react-native library, import 'View' to render a container, 'Text' to render text, 'Modal' to render a component that overlays the screen, 'ActivityIndicator' to render a loading spinner,
// 'TouchableWithoutFeedback' to make the component touchable without any visual feedback, 'ScrollView' to make the component scrollable, 'TouchableOpacity' to make the component touchable

interface RatingModalProps { // create an interface called 'RatingModalProps' to define the props that the component will receive
    visible: boolean; // 'visible' which is a boolean flag to tell whether the component is visible or not
    onClose: () => void; // 'onClose' which is a function that takes nothing as argument and returns nothing
    order: Order | null; // 'order' which is an object of custom type 'Order' or null
    productRatings: { [key: string]: number }; // 'productRatings' which is an object with string as key and number as value
    onRatingChange: (productId: string, rating: number) => void; // 'onRatingChange' which is a function that takes product ID and it's rating as argument and returns nothing
    onSubmit: () => void; // 'onSubmit' which is a function that takes nothing as argument and returns nothing
    isSubmitting: boolean; // 'isSubmitting' which is a boolean flag to tell whether the component is submitting data or not
}

const RatingModal = ({ // create a functional component called 'RatingModal' that takes properties of 'RatingModalProps' interface in destructured form as argument
    visible,
    onClose,
    order,
    productRatings,
    onRatingChange,
    onSubmit,
    isSubmitting,
}: RatingModalProps) => {
    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
        {/* this component is visile if value of 'visible' is true, is transparent, on closing calls 'onClose' function */}
            <TouchableWithoutFeedback onPress={onClose}> {/* pressing this component calls 'onClose' function */}
                <View className="flex-1 bg-black/70 items-center justify-center px-4">
                    <TouchableWithoutFeedback>
                        <View className="bg-surface rounded-3xl p-6 w-full max-w-md max-h-[80%]">
                            <View className="items-center mb-4">
                                <View className="bg-primary/20 rounded-full w-16 h-16 items-center justify-center mb-3">
                                    <Ionicons name="star" size={32} color="#1DB954" />
                                </View>
                                
                                <Text className="text-text-primary text-2xl font-bold mb-1">
                                    Rate Your Products
                                </Text>
                                
                                <Text className="text-text-secondary text-center text-sm">
                                    Rate each product from your order
                                </Text>
                            </View>

                            <ScrollView className="mb-4">
                                {order?.orderItems.map((item, index) => { // iterate over 'orderItems' array of 'order' object as 'item' with 'index' as unique identifier key
                                    const productId = item.product._id; // get product ID from 'item' object
                                    
                                    const currentRating = productRatings[productId] || 0; // get current rating of product from 'productRatings' object (0 if not found)

                                    return (
                                        <View
                                            key={item._id} // set unique ID of this item as unique ID of current component
                                            className={`bg-background-lighter rounded-2xl p-4 ${index < order.orderItems.length - 1 ? "mb-3" : ""}`}
                                            // if 'index' is less than length of 'orderItems' array minus 1, add 'mb-3' add margin from bottom, otherwise not
                                        >
                                            <View className="flex-row items-center mb-3">
                                                <Image
                                                    source={item.image} // render current item's image from 'item' object
                                                    style={{ height: 64, width: 64, borderRadius: 8 }}
                                                />
                                                <View className="flex-1 ml-3">
                                                    <Text className="text-text-primary font-semibold text-sm" numberOfLines={2}>
                                                        {item.name} {/* render current item's name */}
                                                    </Text>
                                                    
                                                    <Text className="text-text-secondary text-xs mt-1">
                                                        Qty: {item.quantity} • ${item.price.toFixed(2)} {/* render current item's quantity and price fixed to 2 decimals */}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="flex-row justify-center">
                                                {[1, 2, 3, 4, 5].map((star) => ( // iterate over an array of numbers from 1 to 5 as 'star' with 'index' as unique identifier key
                                                    <TouchableOpacity
                                                        key={star} // star number is the unique ID of this component
                                                        onPress={() => onRatingChange(productId, star)} // call 'onRatingChange' function with unique ID of product and 'star' as argument when pressed
                                                        activeOpacity={0.7}
                                                        className="mx-1.5"
                                                    >
                                                        <Ionicons
                                                            name={star <= currentRating ? "star" : "star-outline"}
                                                            size={32}
                                                            color={star <= currentRating ? "#1DB954" : "#666"}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="bg-primary rounded-2xl py-4 items-center"
                                    activeOpacity={0.8}
                                    onPress={onSubmit} // when this component is pressed, call 'onSubmit' function
                                    disabled={isSubmitting} // if 'isSubmitting' is true, disable this component ie touching it does nothing
                                >
                                    {isSubmitting ? ( // if value of 'isSubmitting' is true, render loading spinner, otherwise render text 'Submit All Ratings'
                                        <ActivityIndicator size="small" color="#121212" />
                                    ) : (
                                        <Text className="text-background font-bold text-base">Submit All Ratings</Text>
                                    )}
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    className="bg-surface-lighter rounded-2xl py-4 items-center border border-background-lighter"
                                    activeOpacity={0.7}
                                    onPress={onClose} // when this component is pressed, call 'onClose' function
                                    disabled={isSubmitting} // if 'isSubmitting' is true, disable this component ie touching it does nothing
                                >
                                    <Text className="text-text-secondary font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default RatingModal;