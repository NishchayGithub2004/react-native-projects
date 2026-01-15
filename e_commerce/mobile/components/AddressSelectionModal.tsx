import { useAddresses } from "@/hooks/useAddressess"; // import custom hook 'useAddresses' to manage addresses state
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons"; // import Ionicons icon from expo-vector-icons to render icons
import { useState } from "react"; // import 'useState' hook to manage local variables in the component
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
// from react native library, import 'View' to render container, 'Text' to render text, 'Modal' to render container that overlays the screen
// 'TouchableOpacity' to render container that can be pressed, 'ScrollView' to render container that can be scrolled, 'ActivityIndicator' to render loading spinner

interface AddressSelectionModalProps { // create an interface named 'AddressSelectionModalProps' to define props for the component
    // it includes: 'visible' which is a boolean flag to tell whether the modal is visible or not, 'onClose' which is a function that takes no arguments and returns nothing,
    // 'onProceed' which is a function that takes an object of custom type 'Address' as argument and returns nothing, and 'isProcessing' which is a boolean flag to tell whether the component is processing or not
    visible: boolean;
    onClose: () => void;
    onProceed: (address: Address) => void;
    isProcessing: boolean;
}

const AddressSelectionModal = ({ // create a functional component named 'AddressSelectionModal' that takes props of custom type 'AddressSelectionModalProps' in destrucured form
    visible,
    onClose,
    onProceed,
    isProcessing,
}: AddressSelectionModalProps) => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); // create a state variable named 'selectedAddress' of custom type 'Address' and set its initial value to null, function 'setSelectedAddress' to update the values of it's properties
    
    const { addresses, isLoading: addressesLoading } = useAddresses(); // extract 'addresses' and 'isLoading' state as name 'addressesLoading' from custom hook 'useAddresses'

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        {/* this modal is visible if value of 'visible' property is true, is transparent, and on closing the modal, call 'onClose' function */}
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-background rounded-t-3xl h-1/2">
                    <View className="flex-row items-center justify-between p-6 border-b border-surface">
                        <Text className="text-text-primary text-2xl font-bold">Select Address</Text>
                        
                        <TouchableOpacity onPress={onClose} className="bg-surface rounded-full p-2"> {/* when this component is pressed, 'onClose' function is called */}
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        {addressesLoading ? ( // if value of 'addressesLoading' is true, render loading spinner
                            <View className="py-8">
                                <ActivityIndicator size="large" color="#00D9FF" />
                            </View>
                        ) : (
                            <View className="gap-4">
                                {addresses?.map((address: Address) => ( // otherwise, iterate over 'addresses' array and render each address as a touchable component
                                    <TouchableOpacity
                                        key={address._id} // it's unique ID is it's unique identifier
                                        className={`bg-surface rounded-3xl p-6 border-2 ${selectedAddress?._id === address._id // apply green border if selected address's ID matches with current address's ID, black otherwise
                                                ? "border-primary"
                                                : "border-background-lighter"
                                            }`}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedAddress(address)} // when this component is pressed, 'setSelectedAddress' function is called with current address as argument
                                    >
                                        <View className="flex-row items-start justify-between">
                                            <View className="flex-1">
                                                <View className="flex-row items-center mb-3">
                                                    <Text className="text-primary font-bold text-lg mr-2">
                                                        {address.label} {/* render address's label (home, office, etc.) */}
                                                    </Text>
                                                    
                                                    {address.isDefault && ( // if this address is default address ie this is where order is delivered if no address is specified, render 'Default' text
                                                        <View className="bg-primary/20 rounded-full px-3 py-1">
                                                            <Text className="text-primary text-sm font-semibold">Default</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                
                                                {/* render address holder's full name, street address, city, state, zip code, phone number */}
                                                <Text className="text-text-primary font-semibold text-lg mb-2">{address.fullName}</Text>
                                                <Text className="text-text-secondary text-base leading-6 mb-1">{address.streetAddress}</Text>
                                                <Text className="text-text-secondary text-base mb-2">{address.city}, {address.state} {address.zipCode}</Text>
                                                <Text className="text-text-secondary text-base">{address.phoneNumber}</Text>
                                            </View>
                                            
                                            {selectedAddress?._id === address._id && ( // if selected address's ID matches with current address's ID, render checkmark icon
                                                <View className="bg-primary rounded-full p-2 ml-3">
                                                    <Ionicons name="checkmark" size={24} color="#121212" />
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View className="p-6 border-t border-surface">
                        <TouchableOpacity
                            className="bg-primary rounded-2xl py-5"
                            activeOpacity={0.9}
                            onPress={() => {
                                if (selectedAddress) onProceed(selectedAddress); // when this component is pressed, if 'selectedAddress' is not null, call 'onProceed' function with 'selectedAddress' as argument
                            }}
                            disabled={!selectedAddress || isProcessing} // if 'selectedAddress' is null or 'isProcessing' is true, disable this component ie nothing happens when it is pressed
                        >
                            <View className="flex-row items-center justify-center">
                                {isProcessing ? ( // if 'isProcessing' is true, render loading spinner, otherwise render 'Continue to Payment' text and arrow forward icon
                                    <ActivityIndicator size="small" color="#121212" />
                                ) : (
                                    <>
                                        <Text className="text-background font-bold text-lg mr-2">
                                            Continue to Payment
                                        </Text>
                                        <Ionicons name="arrow-forward" size={20} color="#121212" />
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddressSelectionModal;