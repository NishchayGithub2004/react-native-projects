import { View, Text, TouchableOpacity, Platform } from "react-native";
/* from 'react-native' library, import the following components: 'View' to render container for layouts, 'Text' to render text,
'TouchableOpacity' to create JSX that does something on touching, and 'Platform' to apply styles based on platform the app runs on */

import React, { useState } from "react"; // import 'React' library to use JSX and 'useState' to create and manage state variables

import DateTimePicker from "@react-native-community/datetimepicker"; // import 'DateTimePicker' component to render date and time picker

const DatePickerComponent = ({ date, setDate }) => { // create a functional component 'DatePickerComponent' that renders a date and time picker
    // it takes two props: 'date' state variable and 'setDate' function to update this state variable
    
    const [show, setShow] = useState(false); // create a state variable 'show' to show date and time picker with initial value 'false' and a function'setShow' to update it's value

    const onChange = (_, selectedDate) => { // create a function 'onChange' that takes selected date as argument and skips event object as argument
        const currentDate = selectedDate || date; // set current date to selected date or current date if no date is selected
        setShow(false); // hide date picker by setting 'show' state variable to 'false'
        setDate(currentDate); // set 'date' state variable to current date
    };
    
    // create a function 'handlePress' that sets 'show' state variable to 'true' to show date picker

    const handlePress = () => {
        setShow(true);
    };
    
    return (
        <View className="flex flex-row">
            <TouchableOpacity
                onPress={handlePress} // touching this JSX will call 'handlePress' function
                className={`rounded-lg text-white text-base ${Platform.OS === "android" && "px-2 py-1 justify-center bg-[#474747]"}`}
                // apply styles based on whether the app runs on Android or not
            >
                {/* if platformis android, render value of 'date' state variable in string format */}
                {Platform.OS === "android" && (
                    <Text className="px-2 py-1 bg-[#474747] text-white">
                        {date.toLocaleDateString()}
                    </Text>
                )}
                
                {Platform.OS === "android" && show && ( // if platform is android and 'show' state variable is 'true', render date picker
                    <DateTimePicker
                        accentColor="#f49b33"
                        textColor="#f49b33"
                        value={date} // set value of date picker to value of 'date' state variable
                        mode="date"
                        onChange={onChange} // when a new date of time is picked, call 'onChange' function
                        display="default"
                        minimumDate={new Date()} // set minimum date we can choose to current date
                        maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))} // set maximum date we can choose to 7 days from current date
                    />
                )}
                
                {Platform.OS == "ios" && ( // if platform is ios, render date picker
                    <DateTimePicker
                        accentColor="#f49b33"
                        textColor="#f49b33"
                        value={date} // set value of date picker to value of 'date' state variable
                        mode="date"
                        onChange={onChange} // when a new date of time is picked, call 'onChange' function
                        display="default"
                        minimumDate={new Date()} // set minimum date we can choose to current date
                        maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))} // set maximum date we can choose to 7 days from current date
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default DatePickerComponent;