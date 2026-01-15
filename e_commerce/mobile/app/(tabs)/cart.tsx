import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";

const CartScreen = () => {
    const api = useApi(); // create an instance of custom hook 'useApi' to make HTTP requests to the backend
    
    const { cart, cartItemCount, cartTotal, clearCart, isError, isLoading, isRemoving, isUpdating, removeFromCart, updateQuantity } = useCart();
    // extract objects, functions, boolean states, etc. from custom hook 'useCart' (purposes explained in file they are created in)
    
    const { addresses } = useAddresses(); // extract 'addresses' object from custom hook 'useAddresses' to manage addresses of customers

    const { initPaymentSheet, presentPaymentSheet } = useStripe(); // from 'useStripe' hook, extract 'initPaymentSheet' to initialize the payment and 'presentPaymentSheet' to present the payment page to user

    const [paymentLoading, setPaymentLoading] = useState(false); // create a variable 'paymentLoading' with initial value 'false' and function 'setPaymentLoading' to change it's value
    
    const [addressModalVisible, setAddressModalVisible] = useState(false); // create a variable 'addressModalVisible' with initial value 'false' and function 'setAddressModalVisible' to change it's value

    const cartItems = cart?.items || []; // extract 'items' array from 'cart' object
    const subtotal = cartTotal; // extract 'cartTotal' object from 'cart' object
    const shipping = 10.0; // shipping cost of 10 dollars
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax; // calculate total cost of order

    const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => { // create a function named 'handleQuantityChange' to update quantity of items in cart
        // it takes unique ID of item, current quantity of item and change in quantity of item as arguments
        const newQuantity = currentQuantity + change; // calculate new quantity of item after adding given quantity to add to it
        if (newQuantity < 1) return; // if new quantity of item is less than 1, return as it it invalid
        updateQuantity({ productId, quantity: newQuantity }); // call 'updateQuantity' function from 'useCart' hook to update quantity of item in cart, it takes unique ID of product to update quantity of and updated quantity
    };

    const handleRemoveItem = (productId: string, productName: string) => { // create a function named 'handleRemoveItem' to remove item from cart, it takes unique ID of item and name of item as arguments
        // render an alert message to confirm removal of item from cart
        Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => removeFromCart(productId), // on pressing remove button, 'removeFromCart' function from 'useCart' hook to remove item from cart, it takes unique ID of item to remove
            },
        ]);
    };

    const handleCheckout = () => { // create a function named 'handleCheckout' to handle checkout process
        if (cartItems.length === 0) return; // if cart is empty, return as it it invalid

        if (!addresses || addresses.length === 0) { // if no addresses are found, render an alert message that no address exists to send package to
            Alert.alert(
                "No Address",
                "Please add a shipping address in your profile before checking out.",
                [{ text: "OK" }]
            );
            
            return;
        }

        setAddressModalVisible(true); // set 'addressModalVisible' to true
    };

    const handleProceedWithPayment = async (selectedAddress: Address) => { // create a function named 'handleProceedWithPayment' to handle payment process
        // it takes 'selectedAddress' object of type 'Address' as argument
        setAddressModalVisible(false); // set 'addressModalVisible' to false

        try {
            setPaymentLoading(true); // set 'paymentLoading' to true

            const { data } = await api.post("/payment/create-intent", { // make a POST request to '/payment/create-intent' route of API to create a payment intent
                // it takes 'cartItems' array and 'shippingAddress' object as data, this object takes all values of properties of 'selectedAddress' object
                cartItems,
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    streetAddress: selectedAddress.streetAddress,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipCode: selectedAddress.zipCode,
                    phoneNumber: selectedAddress.phoneNumber,
                },
            });

            const { error: initError } = await initPaymentSheet({ // initialize the payment to check for any error that might occur
                paymentIntentClientSecret: data.clientSecret, // set 'paymentIntentClientSecret' to 'clientSecret' property of 'data' object
                merchantDisplayName: "Your Store Name", // set 'merchantDisplayName' to 'Your Store Name'
            });

            // if any error occurs, render an alert message, set 'paymentLoading' to false and stop the execution of the function
            if (initError) {
                Alert.alert("Error", initError.message);
                setPaymentLoading(false);
                return;
            }

            const { error: presentError } = await presentPaymentSheet(); // create an object of 'presentPaymentSheet' to store error if any occurs while presenting payment page

            // if any error occurs, render an alert message, otherwise render an alert message that payment was successful and clear the cart
            if (presentError) {
                Alert.alert("Payment cancelled", presentError.message);
            } else {
                Alert.alert("Success", "Your payment was successful! Your order is being processed.", [
                    { text: "OK", onPress: () => { } },
                ]);
                clearCart();
            }
        } catch (error) { // if any other error occurs, render an alert message
            Alert.alert("Error", "Failed to process payment");
        } finally {
            setPaymentLoading(false); // finally set 'paymentLoading' to false
        }
    };

    if (isLoading) return <LoadingUI />; // if 'isLoading' is true, return 'LoadingUI' component
    
    if (isError) return <ErrorUI />; // if 'isError' is true, return 'ErrorUI' component
    
    if (cartItems.length === 0) return <EmptyUI />; // if cart is empty, return 'EmptyUI' component

    return (
        <SafeScreen>
            <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight">Cart</Text>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 240 }}
            >
                <View className="px-6 gap-2">
                    {cartItems.map((item, _) => ( // iterate over 'cartItems' array as 'item'
                        <View key={item._id} className="bg-surface rounded-3xl overflow-hidden "> {/* item's unique ID is the unique identifier of this container */}
                            <View className="p-4 flex-row">
                                <View className="relative">
                                    <Image
                                        source={item.product.images[0]} // render first item of the product from 'images' array of 'product' object
                                        className="bg-background-lighter"
                                        contentFit="cover"
                                        style={{ width: 112, height: 112, borderRadius: 16 }}
                                    />
                                    
                                    <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                                        <Text className="text-background text-xs font-bold">×{item.quantity}</Text>
                                    </View>
                                </View>

                                <View className="flex-1 ml-4 justify-between">
                                    <View>
                                        <Text
                                            className="text-text-primary font-bold text-lg leading-tight"
                                            numberOfLines={2}
                                        >
                                            {item.product.name} {/* render product name */}
                                        </Text>
                                        
                                        <View className="flex-row items-center mt-2">
                                            <Text className="text-primary font-bold text-2xl">
                                                ${(item.product.price * item.quantity).toFixed(2)} {/* render total price of all products fixed to 2 decimal places */}
                                            </Text>
                                            
                                            <Text className="text-text-secondary text-sm ml-2">
                                                ${item.product.price.toFixed(2)} each {/* render price of each item, fixed to 2 decimal places */}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mt-3">
                                        <TouchableOpacity
                                            className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                                            activeOpacity={0.7}
                                            onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                            // pressing this component calls 'handleQuantityChange' function to decrease quantity of item by 1
                                            disabled={isUpdating} // if value of 'isUpdating' is true, disable this component ie touching it does nothing
                                        >
                                            {isUpdating ? ( // render loading spinner if 'isUpdating' is true, otherwise render 'remove' icon
                                                <ActivityIndicator size="small" color="#FFFFFF" />
                                            ) : (
                                                <Ionicons name="remove" size={18} color="#FFFFFF" />
                                            )}
                                        </TouchableOpacity>

                                        <View className="mx-4 min-w-[32px] items-center">
                                            <Text className="text-text-primary font-bold text-lg">{item.quantity}</Text> {/* render quantity of item */}
                                        </View>

                                        <TouchableOpacity
                                            className="bg-primary rounded-full w-9 h-9 items-center justify-center"
                                            activeOpacity={0.7}
                                            onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                                            // pressing this component calls 'handleQuantityChange' function to increase quantity of item by 1
                                            disabled={isUpdating} // if value of 'isUpdating' is true, disable this component ie touching it does nothing
                                        >
                                            {isUpdating ? ( // render loading spinner if 'isUpdating' is true, otherwise render 'add' icon
                                                <ActivityIndicator size="small" color="#121212" />
                                            ) : (
                                                <Ionicons name="add" size={18} color="#121212" />
                                            )}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                                            activeOpacity={0.7}
                                            onPress={() => handleRemoveItem(item.product._id, item.product.name)}
                                            // pressing this component calls 'handleRemoveItem' function to remove item from cart
                                            disabled={isRemoving}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </ScrollView>

            <View
                className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface pt-4 pb-32 px-6"
            >
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <Ionicons name="cart" size={20} color="#1DB954" />
                        <Text className="text-text-secondary ml-2">
                            {cartItemCount} {cartItemCount === 1 ? "item" : "items"} {/* render number of items in the cart */}
                        </Text>
                    </View>
                    
                    <View className="flex-row items-center">
                        <Text className="text-text-primary font-bold text-xl">${total.toFixed(2)}</Text> {/* render total price of all products, fixed to 2 decimal places */}
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-primary rounded-2xl overflow-hidden"
                    activeOpacity={0.9}
                    onPress={handleCheckout} // clicking this component calls 'handleCheckout' function to handle checkout process
                    disabled={paymentLoading} // if value of 'paymentLoading' is true, disable this component ie touching it does nothing
                >
                    <View className="py-5 flex-row items-center justify-center">
                        {paymentLoading ? ( // render loading spinner if 'paymentLoading' is true, otherwise render text 'Checkout' and arrow icon
                            <ActivityIndicator size="small" color="#121212" />
                        ) : (
                            <>
                                <Text className="text-background font-bold text-lg mr-2">Checkout</Text>
                                <Ionicons name="arrow-forward" size={20} color="#121212" />
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <AddressSelectionModal
                visible={addressModalVisible}
                onClose={() => setAddressModalVisible(false)}
                onProceed={handleProceedWithPayment}
                isProcessing={paymentLoading}
            />
        </SafeScreen>
    );
};

export default CartScreen;

function LoadingUI() {
    return (
        <View className="flex-1 bg-background items-center justify-center">
            <ActivityIndicator size="large" color="#00D9FF" />
            <Text className="text-text-secondary mt-4">Loading cart...</Text>
        </View>
    );
}

function ErrorUI() {
    return (
        <View className="flex-1 bg-background items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
            <Text className="text-text-primary font-semibold text-xl mt-4">Failed to load cart</Text>
            <Text className="text-text-secondary text-center mt-2">Please check your connection and try again</Text>
        </View>
    );
}

function EmptyUI() {
    return (
        <View className="flex-1 bg-background">
            <View className="px-6 pt-16 pb-5">
                <Text className="text-text-primary text-3xl font-bold tracking-tight">Cart</Text>
            </View>
            
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name="cart-outline" size={80} color="#666" />
                <Text className="text-text-primary font-semibold text-xl mt-4">Your cart is empty</Text>
                <Text className="text-text-secondary text-center mt-2">Add some products to get started</Text>
            </View>
        </View>
    );
}