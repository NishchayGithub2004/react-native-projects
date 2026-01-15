import RatingModal from "@/components/RatingModal";
import SafeScreen from "@/components/SafeScreen";
import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { capitalizeFirstLetter, formatDate, getStatusColor } from "@/lib/utils";
import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function OrdersScreen() {
    const { data: orders, isLoading, isError } = useOrders(); // from custom hook 'useOrders', extract 'data' under the name 'orders'
    // 'isLoading' and 'isError' states (purposes explained in file they were created in)
    
    const { createReviewAsync, isCreatingReview } = useReviews(); // from custom hook 'useReviews', extract 'createReviewAsync' and 'isCreatingReiew' function and boolean state

    const [showRatingModal, setShowRatingModal] = useState(false); // create a boolean variable 'showRatingModal' with initial value of 'false' and a function 'setShowRatingModal' to update it's value
    
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // create an object of custom type 'Order' called 'selectedOrder' with initial value of 'null' for all it's properties 
    // and a function'setSelectedOrder' to update it's properties's values
    
    const [productRatings, setProductRatings] = useState<{ [key: string]: number }>({}); // create a map called 'productRatings' with string keys and number values, with initial value of an empty map
    // and a function'setProductRatings' to update it's values

    const handleOpenRating = (order: Order) => { // create a function called 'handleOpenRating' that takes an object of custom type 'Order' as it's argument
        setShowRatingModal(true); // set 'showRatingModal' to 'true'
        
        setSelectedOrder(order); // set 'selectedOrder' to the object passed as it's argument

        const initialRatings: { [key: string]: number } = {}; // create a map called 'initialRatings' with string keys and number values, with initial value of an empty map
        
        order.orderItems.forEach((item) => { // iterate over 'orderItems' array of 'order' object
            // get unique ID of product for each order and mark it's initial ratings as 0
            const productId = item.product._id;
            initialRatings[productId] = 0;
        });
        
        setProductRatings(initialRatings); // set 'productRatings' to the map 'initialRatings'
    };

    const handleSubmitRating = async () => { // create a function called 'handleSubmitRating' that takes no arguments
        if (!selectedOrder) return; // if 'selectedOrder' is null ie no order is selected, don't execute the rest of the function

        const allRated = Object.values(productRatings).every((rating) => rating > 0); // iterate over 'productRatings' map and check if all ratings are greater than 0
        
        // if 'allRated' is false ie not all products are rated, display an alert message that all products must be rated and don't execute the rest of the function
        if (!allRated) {
            Alert.alert("Error", "Please rate all products");
            return;
        }

        try {
            await Promise.all( // resolve all promises
                selectedOrder.orderItems.map((item) => { // iterate over 'orderItems' array of 'order' object
                    createReviewAsync({ // call 'createReviewAsync' function and pass it an object with the following properties:
                        productId: item.product._id, // unique ID of product
                        orderId: selectedOrder._id, // unique ID of order
                        rating: productRatings[item.product._id], // ratings of products
                    });
                })
            );

            Alert.alert("Success", "Thank you for rating all products!"); // display an alert message that thank you for rating all products
            
            setShowRatingModal(false); // set 'showRatingModal' to 'false'
            
            setSelectedOrder(null); // set 'selectedOrder' to 'null'
            
            setProductRatings({}); // set 'productRatings' to an empty map
        } catch (error: any) { // if any error occurs
            Alert.alert("Error", error?.response?.data?.error || "Failed to submit rating"); // display an alert message that failed to submit rating and display the error message if available
        }
    };

    return (
        <SafeScreen>
            <View className="px-6 pb-5 border-b border-surface flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4"> {/* pressing this component takes user back to previous page */}
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text className="text-text-primary text-2xl font-bold">My Orders</Text>
            </View>

            {isLoading ? ( // if 'isLoading' is true ie orders are being fetched, display loading UI
                <LoadingUI />
            ) : isError ? ( // if 'isError' is true ie failed to fetch orders, display error UI
                <ErrorUI />
            ) : !orders || orders.length === 0 ? ( // if 'orders' is null or empty, display empty UI
                <EmptyUI />
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View className="px-6 py-4">
                        {orders.map((order) => { // iterate over 'orders' array as 'order'
                            const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0); // calculate total items in order
                            
                            const firstImage = order.orderItems[0]?.image || ""; // get first image of order

                            return (
                                <View key={order._id} className="bg-surface rounded-3xl p-5 mb-4"> {/* unique ID of order is unique identifier of this container */}
                                    <View className="flex-row mb-4">
                                        <View className="relative">
                                            <Image
                                                source={firstImage} // render the first image of product found
                                                style={{ height: 80, width: 80, borderRadius: 8 }}
                                                contentFit="cover"
                                            />

                                            {order.orderItems.length > 1 && ( // if 'orderItems' array of 'order' object have more than one element ie more than one product is ordered
                                                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center">
                                                    <Text className="text-background text-xs font-bold">
                                                        +{order.orderItems.length - 1} {/* display number of remaining products ordered */}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <View className="flex-1 ml-4">
                                            <Text className="text-text-primary font-bold text-base mb-1">
                                                Order #{order._id.slice(-8).toUpperCase()} {/* render last 8 characters of unique ID of order, capitalized */}
                                            </Text>
                                            
                                            <Text className="text-text-secondary text-sm mb-2">
                                                {formatDate(order.createdAt)} {/* render the date at which order was made in desired format using 'formatDate' function */}
                                            </Text>
                                            
                                            <View
                                                className="self-start px-3 py-1.5 rounded-full"
                                                style={{ backgroundColor: getStatusColor(order.status) + "20" }} // get order status to apply appropriate style
                                            >
                                                <Text
                                                    className="text-xs font-bold"
                                                    style={{ color: getStatusColor(order.status) }} // get order status to apply appropriate style
                                                >
                                                    {capitalizeFirstLetter(order.status)} {/* render order status with first letter capitalized */}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {order.orderItems.map((item, _) => ( // iterate over 'orderItems' array of 'order' object as 'item'
                                        <Text
                                            key={item._id} // unique ID of product is unique identifier of this container
                                            className="text-text-secondary text-sm flex-1"
                                            numberOfLines={1}
                                        >
                                            {item.name} x {item.quantity} {/* render item name and it's quantity */}
                                        </Text>
                                    ))}

                                    <View className="border-t border-background-lighter pt-3 flex-row justify-between items-center">
                                        <View>
                                            <Text className="text-text-secondary text-xs mb-1">{totalItems} items</Text>
                                            <Text className="text-primary font-bold text-xl">${order.totalPrice.toFixed(2)}</Text>
                                            {/* render total price of product, fixed to 2 decimal places */}
                                        </View>

                                        {order.status === "delivered" && // if order has been delivered
                                            (order.hasReviewed ? ( // check if order has been reviewed
                                                <View className="bg-primary/20 px-5 py-3 rounded-full flex-row items-center">
                                                    <Ionicons name="checkmark-circle" size={18} color="#1DB954" />
                                                    <Text className="text-primary font-bold text-sm ml-2">Reviewed</Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    className="bg-primary px-5 py-3 rounded-full flex-row items-center"
                                                    activeOpacity={0.7}
                                                    onPress={() => handleOpenRating(order)} // pressing this component calls 'handleOpenRating' function and pass 'order' object as it's argument
                                                >
                                                    <Ionicons name="star" size={18} color="#121212" />
                                                    <Text className="text-background font-bold text-sm ml-2">Leave Rating</Text>
                                                </TouchableOpacity>
                                            ))}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            )}

            <RatingModal
                visible={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                order={selectedOrder}
                productRatings={productRatings}
                onSubmit={handleSubmitRating}
                isSubmitting={isCreatingReview}
                onRatingChange={(productId, rating) =>
                    setProductRatings((prev) => ({ ...prev, [productId]: rating }))
                }
            />
        </SafeScreen>
    );
}

export default OrdersScreen;

function LoadingUI() {
    return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#00D9FF" />
            <Text className="text-text-secondary mt-4">Loading orders...</Text>
        </View>
    );
}

function ErrorUI() {
    return (
        <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
            <Text className="text-text-primary font-semibold text-xl mt-4">Failed to load orders</Text>
            <Text className="text-text-secondary text-center mt-2">Please check your connection and try again</Text>
        </View>
    );
}

function EmptyUI() {
    return (
        <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="receipt-outline" size={80} color="#666" />
            <Text className="text-text-primary font-semibold text-xl mt-4">No orders yet</Text>
            <Text className="text-text-secondary text-center mt-2">Your order history will appear here</Text>
        </View>
    );
}