export const capitalizeFirstLetter = (text: string) => { // create a function to capitalize the first letter of a string, it takes a stsring as a parameter and returns a string/argument
    return text.charAt(0).toUpperCase() + text.slice(1); // convert first letter of given text to uppercase and concatenate it with the rest of the string
};

export const formatDate = (dateString: string) => { // create a function to format a date string, it takes a date string as a parameter and returns a string/argument
    const date = new Date(dateString); // create a new date object from the given date string
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    // return it in US format, with month first in short form ('Jan', 'Feb', etc.), day as a number, and year as a number
};

export const getStatusColor = (status: string) => { // create a function to get hex code color for a given status, it takes a status string as a parameter and returns a string/argument
    switch (status.toLowerCase()) { // convert status to lowercase and use switch case to return the hex code color for each status
        case "delivered": // if status is "delivered" ie product has been delivered
            return "#10B981"; // return hex code color for green
        case "shipped": // if status is "shipped" ie product has been shipped
            return "#3B82F6"; // return hex code color for blue
        case "pending": // if status is "pending" ie product has not been shipped or delivered
            return "#F59E0B"; // return hex code color for yellow
        default: // if status is not one of the above
            return "#666"; // return hex code color for gray
    }
};