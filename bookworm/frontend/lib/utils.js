export function formatMemberSince(dateString) { // export function to format a date into a concise "member since" label for user profiles
    const date = new Date(dateString); // convert incoming date string into a Date object to extract parts dynamically
    const month = date.toLocaleString("default", { month: "short" }); // obtain abbreviated month name so output remains compact and readable
    const year = date.getFullYear(); // extract full year to represent the membership start date
    return `${month} ${year}`; // return formatted string for display in UI components such as profile headers
}

export function formatPublishDate(dateString) { // export function to format a publish timestamp for articles or posts into a long-form readable date
    const date = new Date(dateString); // convert incoming string into a Date object to derive month, day, and year
    const month = date.toLocaleString("default", { month: "long" }); // obtain full month name to give a more descriptive publication date
    const day = date.getDate(); // extract numeric day of month for accurate date representation
    const year = date.getFullYear(); // extract full year for complete publish date context
    return `${month} ${day}, ${year}`; // return formatted date string suitable for display in content metadata sections
}