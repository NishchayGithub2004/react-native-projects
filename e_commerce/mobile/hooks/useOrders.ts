import { useQuery } from "@tanstack/react-query"; // from tanstack library, import 'useQuery' hook to fetch data from the backend server
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make HTTP requests to the backend server
import { Order } from "@/types";

export const useOrders = () => { // create and export a custom hook called 'useOrders'
    const api = useApi(); // create an instance of 'useApi' hook to make HTTP requests to the backend server

    return useQuery<Order[]>({ // useQuery hook is used to fetch data of custom type 'Order' from the backend server
        queryKey: ["orders"], // 'queryKey' is a unique identifier for this query, it is named here as 'orders'
        queryFn: async () => { // 'queryFn' is the function that will fetch the data from the backend server
            const { data } = await api.get("/orders"); // make a GET request to '/orders' backend endpoint
            return data.orders; // return the data that comes from the backend server
        },
    });
};