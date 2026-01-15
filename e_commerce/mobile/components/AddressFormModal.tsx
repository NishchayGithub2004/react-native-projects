import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
// from react native library, import the following components: 'View' to act as a container of JSX elements, 'Text' to render text, 'Modal' to render JSX above screen like a popup
// 'TouchableOpacity' to render a button that can be pressed to do some action , 'ScrollView' to render a scrollable JSX content, 'TextInput' to render a text input field, 
// 'Switch' to render a switch component that enables and/or disables something on clicking, 'ActivityIndicator' to render a loading spinner, 
// 'KeyboardAvoidingView' to render a view that avoids the keyboard from covering input field when it appears, 'Platform' to detect operating system like Android, iOS, etc.

import SafeScreen from "./SafeScreen";
import { Ionicons } from "@expo/vector-icons"; // import 'Ionicons' component from expo-vector-icons library to use icons

interface AddressFormData { // create an interface called 'AddressFormData' to define the structure of the address
    // it includes the following properties: 'label' to store the label of the address (like home, office, etc.), 'fullName' to store the full name of the person whose order it is,
    // steet address, name, state, zip code, phone number of the person whose order it is, and 'isDefault' to store a boolean value indicating whether this address is the default address or not
    // default address means that if the user has multiple addresses, then this address will be the default address unless user specifies otherwise
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    isDefault: boolean;
}

interface AddressFormModalProps { // create an interface called 'AddressFormModalProps' to define the props the component will receive
    visible: boolean; // a boolean prop called 'visible' to indicate whether the modal is visible or not
    isEditing: boolean; // a boolean prop called 'isEditing' to indicate whether the component is in editing mode or not
    addressForm: AddressFormData; // an object prop called 'addressForm' of custom type 'AddressFormData' to store the current state of the address form
    isAddingAddress: boolean; // a boolean prop called 'isAddingAddress' to indicate whether the component is adding address or not
    isUpdatingAddress: boolean; // a boolean prop called 'isUpdatingAddress' to indicate whether the component is updating address or not
    onClose: () => void; // 'onClose' which is a function that takes nothing as argument and returns nothing
    onSave: () => void; // 'onSave' which is a function that takes nothing as argument and returns nothing
    onFormChange: (form: AddressFormData) => void; // 'onFormChange' which is a function that takes an object of type 'AddressFormData' as argument and returns nothing
}

const AddressFormModal = ({ // create a functional component called 'AddressFormModal' that takes properties of interface 'AddressFormModalProps' in destructured form as argument
    addressForm,
    isAddingAddress,
    isEditing,
    isUpdatingAddress,
    onClose,
    onFormChange,
    onSave,
    visible,
}: AddressFormModalProps) => {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        {/* this component is visible is value of boolean prop 'visible' is true, 'onClose' function is called when this component is to be closed */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} // if this component is running on iOS, then padding is applied to avoid keyboard covering input field, otherwise height is applied
                className="flex-1"
            >
                <SafeScreen>
                    <View className="px-6 py-5 border-b border-surface flex-row items-center justify-between">
                        <Text className="text-text-primary text-2xl font-bold">
                            {isEditing ? "Edit Address" : "Add New Address"} {/* render first text if value of boolean prop 'isEditing' is true ie address is being edited */}
                        </Text>
                        
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="#FFFFFF" /> {/* render close icon */}
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false} // do not show scroll indicator for this
                    >
                        <View className="p-6">
                        {/* this view contains all form fields, their values go to respective properties of 'addressForm' object and when their values change in input field
                        'onFormChange' function is called which copies all existing values of 'addressForm' object and change value of property the current form input field exists for to value given in input field
                        except 'isDefault' property which is manipulated by a checkbox, clicking it toggles it's value b/w true and false */}
                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">Label</Text>
                                <TextInput
                                    className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                                    placeholder="e.g., Home, Work, Office"
                                    placeholderTextColor="#666"
                                    value={addressForm.label}
                                    onChangeText={(text) => onFormChange({ ...addressForm, label: text })}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">Full Name</Text>
                                <TextInput
                                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#666"
                                    value={addressForm.fullName}
                                    onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">Street Address</Text>
                                <TextInput
                                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                                    placeholder="Street address, apt/suite number"
                                    placeholderTextColor="#666"
                                    value={addressForm.streetAddress}
                                    onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
                                    multiline
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">City</Text>
                                <TextInput
                                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                                    placeholder="e.g., New York"
                                    placeholderTextColor="#666"
                                    value={addressForm.city}
                                    onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">State</Text>
                                <TextInput
                                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                                    placeholder="e.g., NY"
                                    placeholderTextColor="#666"
                                    value={addressForm.state}
                                    onChangeText={(text) => onFormChange({ ...addressForm, state: text })}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">ZIP Code</Text>
                                <TextInput
                                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                                    placeholder="e.g., 10001"
                                    placeholderTextColor="#666"
                                    value={addressForm.zipCode}
                                    onChangeText={(text) => onFormChange({ ...addressForm, zipCode: text })}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-text-primary font-semibold mb-2">Phone Number</Text>
                                <TextInput
                                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                                    placeholder="+1 (555) 123-4567"
                                    placeholderTextColor="#666"
                                    value={addressForm.phoneNumber}
                                    onChangeText={(text) => onFormChange({ ...addressForm, phoneNumber: text })}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6">
                                <Text className="text-text-primary font-semibold">Set as default address</Text>
                                <Switch
                                    value={addressForm.isDefault}
                                    onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
                                    thumbColor="white"
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-primary rounded-2xl py-5 items-center"
                                activeOpacity={0.8}
                                onPress={onSave}
                                disabled={isAddingAddress || isUpdatingAddress}
                            >
                                {isAddingAddress || isUpdatingAddress ? (
                                    <ActivityIndicator size="small" color="#121212" />
                                ) : (
                                    <Text className="text-background font-bold text-lg">
                                        {isEditing ? "Save Changes" : "Add Address"} {/* render first text if value of 'isEditing' is true ie form is being edited, otherwise render second text */}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeScreen>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddressFormModal;