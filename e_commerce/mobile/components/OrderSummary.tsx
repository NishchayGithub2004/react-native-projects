import { View, Text } from "react-native"; // from react native library, import 'View' component to render a container and 'Text' component to render text

interface OrderSummaryProps { // define an interface called 'OrderSummaryProps' to define the props for 'OrderSummary' component
    // it includes: 'subtotal', 'shipping', 'tax' and 'total', all of type numbers
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) { // create a function called 'OrderSummary' that takes properties of interface 'OrderSummaryProps' as props
    return (
        <View className="px-6 mt-6">
            <View className="bg-surface rounded-3xl p-5">
                <Text className="text-text-primary text-xl font-bold mb-4">Summary</Text>

                <View className="space-y-3">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-text-secondary text-base">Subtotal</Text>
                        <Text className="text-text-primary font-semibold text-base">
                            ${subtotal.toFixed(2)} {/* render price of all products fixed to 2 decimal places */}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-text-secondary text-base">Shipping</Text>
                        <Text className="text-text-primary font-semibold text-base">
                            ${shipping.toFixed(2)} {/* render shipping cost fixed to 2 decimal places */}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-text-secondary text-base">Tax</Text>
                        <Text className="text-text-primary font-semibold text-base">${tax.toFixed(2)}</Text> {/* render tax fixed to 2 decimal places */}
                    </View>

                    <View className="border-t border-background-lighter pt-3 mt-1" />

                    <View className="flex-row justify-between items-center">
                        <Text className="text-text-primary font-bold text-lg">Total</Text>
                        <Text className="text-primary font-bold text-2xl">${total.toFixed(2)}</Text> {/* render total cost fixed to 2 decimal places */}
                    </View>
                </View>
            </View>
        </View>
    );
}