import { useQuery } from "@tanstack/react-query"; // from tanstack library, import the 'useQuery' hook to fetch data from the backend server
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make HTTP requests to the backend server
import { Product } from "@/types";

export const useProduct = (productId: string) => { // create and export a custom hook called 'useProduct' that takes string 'productId' as an argument
    // ie it takes unique ID of the product in string form as an argument
    const api = useApi(); // create an instance of 'useApi' hook to make HTTP requests to the backend server

    const result = useQuery<Product>({ // useQuery hook is used to fetch data of custom type 'Product' from the backend server
        queryKey: ["product", productId], // 'queryKey' is a unique identifier for the query, here it is 'product' + its unique ID
        queryFn: async () => { // 'queryFn' is the function that will fetch the data from the backend server (cannot be renamed since it is a property of useQuery hook)
            const { data } = await api.get<Product>(`/products/${productId}`); // make a GET request to '/products/${productId}' backend endpoint
            return data; // return the data that comes from the backend server
        },
        enabled: !!productId, // 'enabled' is a boolean value to indicate whether the query should be executed or not
        // it's value is '!!productId' where '!!' is a double negation operator that converts the value of 'productId' to a boolean value
        // without negating it's value, so if 'productId' exists, only then the query will be executed
    });

    return result; // return the result of running the query
};