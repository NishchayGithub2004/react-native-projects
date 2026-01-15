import { View, Text, TouchableOpacity } from "react-native"; // from react native library, import the following components
// 'View' to create a container of components, 'Text' to display text, 'TouchableOpacity' to make components clickable
import { Ionicons } from "@expo/vector-icons"; // from expo library, import the 'Ionicons' component to use icons
import { Address } from "@/types";

interface AddressCardProps { // create an interface called 'AddressCardProps' to pass props to the component which contains the following properties:
    address: Address; // 'address' which is of custom type 'Address'
    onEdit: (address: Address) => void; // 'onEdit' which is a function that takes an 'address' of custom type 'Address' and returns nothing
    onDelete: (addressId: string, label: string) => void; // 'onDelete' which is a function that takes an 'addressId' and 'label' of type 'string' and returns nothing
    isUpdatingAddress: boolean; // 'isUpdatingAddress' which is a boolean flag to tell whether an address is being updated or not
    isDeletingAddress: boolean; // 'isDeletingAddress' which is a boolean flag to tell whether an address is being deleted or not
}

export default function AddressCard({ // create a function called 'AddressCard' which takes properties of 'AddressCardProps' interface as props
    address,
    onEdit,
    onDelete,
    isUpdatingAddress,
    isDeletingAddress,
}: AddressCardProps) {
    return (
        <View className="bg-surface rounded-3xl p-5 mb-3">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-3">
                        <Ionicons name="location" size={24} color="#1DB954" /> {/* render location icon */}
                    </View>
                    <Text className="text-text-primary font-bold text-lg">{address.label}</Text> {/* render address label name */}
                </View>
                
                {address.isDefault && ( // if 'isDefault' property of 'address' is true ie by default this is where product must be shipped
                    // if no shipping address is mentioned, render this JSX
                    <View className="bg-primary px-3 py-1 rounded-full">
                        <Text className="text-background text-xs font-bold">Default</Text>
                    </View>
                )}
            </View>
            
            <View className="ml-15">
                {/* render following details of user and shipping location: full name, street address, city, state, zip code, and finally phone number */}
                <Text className="text-text-primary font-semibold mb-1">{address.fullName}</Text>
                <Text className="text-text-secondary text-sm mb-1">{address.streetAddress}</Text>
                <Text className="text-text-secondary text-sm mb-2">{address.city}, {address.state} {address.zipCode}</Text>
                <Text className="text-text-secondary text-sm">{address.phoneNumber}</Text>
            </View>
            
            <View className="flex-row mt-4 gap-2">
                <TouchableOpacity
                    className="flex-1 bg-primary/20 py-3 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => onEdit(address)} // clicking this button calls 'onEdit' function with 'address' object as argument
                    disabled={isUpdatingAddress} // if value of 'isUpdatingAddress' is true ie address is being updated, disable this button ie make it unclickable
                >
                    <Text className="text-primary font-bold">Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    className="flex-1 bg-red-500/20 py-3 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => onDelete(address._id, address.label)}
                    // clicking this button calls 'onDelete' function with unique ID of 'address' object and value of its 'label' property as arguments
                    disabled={isDeletingAddress} // if value of 'isDeletingAddress' is true ie address is being deleted, disable this button ie make it unclickable
                >
                    <Text className="text-red-500 font-bold">Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}