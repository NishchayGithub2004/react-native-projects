import { useQuery } from "@tanstack/react-query"; // from tanstack library, import the 'useQuery' hook to fetch data and handle side effects
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make HTTP requests to the backend server
import { Product } from "@/types";

const useProducts = () => { // create and export a custom hook called 'useProducts'
    const api = useApi(); // create an instance of 'useApi' hook to make HTTP requests to the backend server

    const result = useQuery({ // useQuery hook is used to fetch data from the backend server
        queryKey: ["products"], // 'queryKey' is a unique identifier for the query, here named 'products'
        queryFn: async () => { // 'queryFn' is the function that will fetch the data from the backend server
            const { data } = await api.get<Product[]>("/products"); // make a GET request to '/products' backend endpoint, it must look for custom type 'Product'
            return data; // return the data that comes from the backend server
        },
    });

    return result; // return the result of the query
};

export default useProducts;