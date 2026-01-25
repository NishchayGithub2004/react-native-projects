import { View, Text, TouchableOpacity } from "react-native";
// from 'react-native' library, import the following components: 'View' to render container for layouts, 'Text' to render text, and 'TouchableOpacity' to create JSX that does something on touching

import React from "react"; // import 'React' library to use JSX

const GuestPickerComponent = ({ selectedNumber, setSelectedNumber }) => { // create a functional component 'DatePickerComponent' that renders guest picker
    // it takes two props: 'selectedNumber' state variable and 'setSelectedNumber' function to update this state variable
    
    // create a function named 'decrement' that decrements value of 'selectedNumber' state variable by 1 if it's current value greater than 1
    const decrement = () => {
        if (selectedNumber > 1) setSelectedNumber(selectedNumber - 1);
    };
    
    // create a function named 'increment' that increments value of'selectedNumber' state variable by 1 if it's current value less than 12
    const increment = () => {
        if (selectedNumber < 12) setSelectedNumber(selectedNumber + 1);
    };
    
    return (
        <View className="flex flex-row items-center rounded-lg text-white text-base">
            <TouchableOpacity onPress={decrement} className="rounded"> {/* when this text is pressed, 'decrement' function is called */}
                <Text className="text-white text-lg border border-[#f49b33] rounded-l-lg px-3">-</Text>
            </TouchableOpacity>
            
            <Text className="px-3 text-white bg-[#474747] border border-[#474747] text-lg">{selectedNumber}</Text>
            
            <TouchableOpacity onPress={increment} className="rounded"> {/* when this text is pressed, 'increment' function is called */}
                <Text className="text-white text-lg border border-[#f49b33] rounded-r-lg px-3">+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default GuestPickerComponent;