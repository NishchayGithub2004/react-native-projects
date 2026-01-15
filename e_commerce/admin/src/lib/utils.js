export const capitalizeText = (text) => { // create a function to capitalize a text, it takes a text as a parameter/agument
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1); // return the first character of the text capitalized, and rest of the text just the same
};

export const getOrderStatusBadge = (status) => { // create a function to get a badge based on order status, it takes status of order as a parameter/agument
    switch (status?.toLowerCase()) { // use switch-case to return the status badge based on the status of order
        case "delivered": // if status is 'delivered', return 'badge-success'
            return "badge-success";
        case "shipped": // if status is 'shipped', return 'badge-info'
            return "badge-info";
        case "pending": // if status is 'pending', return 'badge-warning'
            return "badge-warning";
        default: // otherwise, return 'badge-ghost'
            return "badge-ghost";
    }
};

export const getStockStatusBadge = (stock) => { // create a function to get a badge and text based on the stock status, it takes quantity in stock as a parameter/agument
    if (stock === 0) return { text: "Out of Stock", class: "badge-error" }; // if stock is 0/empty, return 'Out of Stock' as text and 'badge-error'
    if (stock < 20) return { text: "Low Stock", class: "badge-warning" }; // if stock is less than 20, return 'Low Stock' as text and 'badge-warning'
    return { text: "In Stock", class: "badge-success" }; // otherwise, return 'In Stock' as text and 'badge-success'
};

export const formatDate = (dateString) => { // create a function to format a date, it takes a date as a parameter/agument
    if (!dateString) return ""; // if date is empty or not provided, return an empty string
    
    const date = new Date(dateString); // create a new instance of Date object with the provided date
    
    if (isNaN(date.getTime())) return ""; // if there is no time provided in created instance, return an empty string

    return new Date(dateString).toLocaleDateString("en-US", { // otherwise, return an instance of Date object with day formatted in american format ie
        // month first in short form ('Jan', 'Feb', etc.), then day in numeric form and finally year, also in numeric form
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};