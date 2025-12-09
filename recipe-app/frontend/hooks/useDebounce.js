import { useState, useEffect } from "react"; // import state and effect hooks so the debounce logic can store state and respond to value changes

export function useDebounce(value, delay) { // define a custom hook named useDebounce to return a delayed version of an input value
    const [debouncedValue, setDebouncedValue] = useState(value); // create state to hold the debounced value so components receive an updated value only after delay

    useEffect(() => { // register an effect to update the debounced output
        const handler = setTimeout(() => setDebouncedValue(value), delay); // schedule a timeout to update debounced value after specified delay to implement debouncing behavior

        return () => clearTimeout(handler); // clear the timeout when effect re-runs or component unmounts to prevent stale updates
    }, [value, delay]); // re-run effect when either value or delay changes ensuring debounce logic adapts dynamically

    return debouncedValue; // return the final debounced value so consuming components can use the delayed state
}