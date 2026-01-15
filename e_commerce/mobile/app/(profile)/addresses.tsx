import AddressCard from "@/components/AddressCard";
import AddressesHeader from "@/components/AddressesHeader";
import AddressFormModal from "@/components/AddressFormModal";
import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function AddressesScreen() {
    const { addAddress, addresses, deleteAddress, isAddingAddress, isDeletingAddress, isError, isLoading, isUpdatingAddress, updateAddress} = useAddresses(); 
    // from 'useAddresses' hook, import 'addAddress', 'addresses', 'deleteAddress', 'isAddingAddress', 'isDeletingAddress', 'isError', 'isLoading', 'isUpdatingAddress', 'updateAddress' functions and states (purposes explained in file they were created in)
    
    const [showAddressForm, setShowAddressForm] = useState(false); // create a variable 'showAddressForm' with initial value of 'false' and 'setShowAddressForm' function to change it's value
    
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null); // create a variable 'showAddressForm' with initial value of 'null' and 'setShowAddressForm' function to change it's value
    
    // create an object called 'addressForm' with initial values of empty string and false for each field in the address form and function 'setAddressForm' function to change the values of object properties
    const [addressForm, setAddressForm] = useState({
        label: "",
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        isDefault: false,
    });

    const handleAddAddress = () => { // create a function called 'handleAddAddress' to actually add addresses to database
        setShowAddressForm(true); // set value of 'showAddressForm' to 'true' to show address form
        
        setEditingAddressId(null); // set value of' editingAddressId' to 'null' to start form editing from scratch
        
        // set value of all object properties in 'addressForm' to empty string and false to start form editing from scratch
        setAddressForm({
            label: "",
            fullName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
            isDefault: false,
        });
    };

    const handleEditAddress = (address: Address) => { // create a function called 'handleEditAddress' to actually edit addresses in database, it takes 'address' object or custom type 'Address' as argument
        setShowAddressForm(true); // set value of'showAddressForm' to 'true' to show address form
        
        setEditingAddressId(address._id); // set value of' editingAddressId' to unique ID of address to edit the address with the id of the address passed in
        
        // set value of all object properties in 'addressForm' to values passed in 'address' object
        setAddressForm({
            label: address.label,
            fullName: address.fullName,
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            phoneNumber: address.phoneNumber,
            isDefault: address.isDefault,
        });
    };

    const handleDeleteAddress = (addressId: string, label: string) => { // create a function called 'handleDeleteAddress' to actually delete addresses from database, it takes unique ID of address and label of address as arguments
        // show an alert box with title 'Delete Address' and message 'Are you sure you want to delete {label}' and two buttons 'Cancel' and 'Delete', when 'Delete' button is pressed, call 'deleteAddress' function with 'addressId' as argument to delete the address 
        // with the unique ID of the address passed as argument, 'cancel' button does nothing and closes the alert box
        Alert.alert("Delete Address", `Are you sure you want to delete ${label}`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteAddress(addressId) },
        ]);
    };

    const handleSaveAddress = () => { // create a function called 'handleSaveAddress' to actually save addresses to database
        // if any of the object properties in 'addressForm' is empty, show an alert box with title 'Error' and message 'Please fill in all fields' and return to prevent further execution of the function
        if (
            !addressForm.label ||
            !addressForm.fullName ||
            !addressForm.streetAddress ||
            !addressForm.city ||
            !addressForm.state ||
            !addressForm.zipCode ||
            !addressForm.phoneNumber
        ) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (editingAddressId) { // if value of 'editingAddressId' is not null ie updated address ID is provided
            // call 'updateAddress' function with 'editingAddressId' and 'addressForm' as arguments of values 'addressId' and 'addressData' to update the address
            updateAddress(
                {
                    addressId: editingAddressId,
                    addressData: addressForm,
                },
                {
                    onSuccess: () => { // when the address is updated successfully
                        setShowAddressForm(false); // set 'showAddressForm' to 'false' to hide address form
                        setEditingAddressId(null); // set' editingAddressId' to 'null' to start form editing from scratch later
                        Alert.alert("Success", "Address updated successfully"); // show an alert box with title 'Success' and message 'Address updated successfully'
                    },
                    onError: (error: any) => { // if any error occurs while updating the address
                        // show an alert box with title 'Error' and message 'Failed to update address' or error messag from 'error' object if available
                        Alert.alert("Error", error?.response?.data?.error || "Failed to update address");
                    },
                }
            );
        } else { // if 'editingAddressId' is false ie address is not being updated
            addAddress(addressForm, { // call 'addAddress' function with 'addressForm' as argument to add the address to the database
                onSuccess: () => { // when the address is added successfully
                    setShowAddressForm(false); // set'showAddressForm' to 'false' to hide address form
                    Alert.alert("Success", "Address added successfully"); // show an alert box with title 'Success' and message 'Address added successfully'
                },
                onError: (error: any) => { // if any error occurs while adding the address
                    Alert.alert("Error", error?.response?.data?.error || "Failed to add address"); // show an alert box with title 'Error' and message 'Failed to add address' or error messag from 'error' object if available
                },
            });
        }
    };

    const handleCloseAddressForm = () => { // create a function called 'handleCloseAddressForm' to actually close address form
        setShowAddressForm(false); // set'showAddressForm' to 'false' to hide address form
        setEditingAddressId(null); // set' editingAddressId' to 'null' to start form editing from scratch later
    };

    if (isLoading) return <LoadingUI />; // if 'isLoading' is true ie address form is being loaded, return 'LoadingUI' component
    
    if (isError) return <ErrorUI />; // if 'isError' is true ie any error occured while loading the address form, return 'ErrorUI' component

    return (
        <SafeScreen>
            <AddressesHeader />

            {addresses.length === 0 ? ( // render the following component is 'addresses' array is empty
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="location-outline" size={80} color="#666" />
                    
                    <Text className="text-text-primary font-semibold text-xl mt-4">No addresses yet</Text>
                    
                    <Text className="text-text-secondary text-center mt-2">Add your first delivery address</Text>
                    
                    <TouchableOpacity
                        className="bg-primary rounded-2xl px-8 py-4 mt-6"
                        activeOpacity={0.8}
                        onPress={handleAddAddress} // pressing this component calls 'handleAddAddress' function
                    >
                        <Text className="text-background font-bold text-base">Add Address</Text>
                    </TouchableOpacity>
                </View>
            ) : ( // if 'addresses' array is not empty, render the following component
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View className="px-6 py-4">
                        {addresses.map((address) => ( // iterate over 'addresses' array as 'address' and render 'AddressCard' component for each address
                            <AddressCard
                                key={address._id}
                                address={address}
                                onEdit={handleEditAddress}
                                onDelete={handleDeleteAddress}
                                isUpdatingAddress={isUpdatingAddress}
                                isDeletingAddress={isDeletingAddress}
                            />
                        ))}

                        <TouchableOpacity
                            className="bg-primary rounded-2xl py-4 items-center mt-2"
                            activeOpacity={0.8}
                            onPress={handleAddAddress} // pressing this component calls 'handleAddAddress' function
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="add-circle-outline" size={24} color="#121212" />
                                <Text className="text-background font-bold text-base ml-2">Add New Address</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            <AddressFormModal
                visible={showAddressForm}
                isEditing={!!editingAddressId}
                addressForm={addressForm}
                isAddingAddress={isAddingAddress}
                isUpdatingAddress={isUpdatingAddress}
                onClose={handleCloseAddressForm}
                onSave={handleSaveAddress}
                onFormChange={setAddressForm}
            />
        </SafeScreen>
    );
}

export default AddressesScreen;

function ErrorUI() {
    return (
        <SafeScreen>
            <AddressesHeader />
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                <Text className="text-text-primary font-semibold text-xl mt-4">Failed to load addresses</Text>
                <Text className="text-text-secondary text-center mt-2">Please check your connection and try again</Text>
            </View>
        </SafeScreen>
    );
}

function LoadingUI() {
    return (
        <SafeScreen>
            <AddressesHeader />
            <View className="flex-1 items-center justify-center px-6">
                <ActivityIndicator size="large" color="#00D9FF" />
                <Text className="text-text-secondary mt-4">Loading addresses...</Text>
            </View>
        </SafeScreen>
    );
}