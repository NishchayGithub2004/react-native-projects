import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // from tanstack library, import the followin hooks:
// 'useMutation' to perform write operations like POST, PUT, DELETE, PATCH to create, update and delete data and handle side effects
// 'useQuery' to perform read operations like GET to fetch data and handle side effects, 'useQueryClient' to interact manually with the fetched data
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make HTTP requests to the backend server
import { Product } from "@/types";

const useWishlist = () => { // create and export a custom hook called 'useWishlist'
    const api = useApi(); // create an instance of 'useApi' hook to make HTTP requests to the backend server
    
    const queryClient = useQueryClient(); // create an instance of 'useQueryClient' hook to interact manually with the fetched data

    const { // following three things are to be extracted from 'useQuery' hook
        data: wishlist, // data under the name 'wishlist'
        isLoading, // 'isLoading' which is a boolean value to indicate whether the data is being fetched or not
        isError, // 'isError' which is a boolean value to indicate whether there was an error while fetching the data or not
    } = useQuery({ // useQuery hook is used to fetch data from the backend server
        queryKey: ["wishlist"], // 'queryKey' is a unique identifier for the query, here it is 'wishlist'
        queryFn: async () => { // 'queryFn' is the function that will fetch the data from the backend server (cannot be renamed since it is a property of useQuery hook)
            const { data } = await api.get<{ wishlist: Product[] }>("/users/wishlist"); // make a GET request to '/users/wishlist' backend endpoint
            // typescript type annotation is also given that data to fetch at this endpoint is an array of wishlist, each wishlist being an instance of 'Product' interface
            return data.wishlist; // return the data from the backend server
        },
    });

    const addToWishlistMutation = useMutation({ // create an instance of 'useMutation' hook for POST request
        mutationFn: async (productId: string) => { // 'mutationFn' is the function that will be called when the mutation is triggered
            // it takes unique ID of product as an argument which is of type 'string'
            const { data } = await api.post<{ wishlist: string[] }>("/users/wishlist", { productId });
            // make a POST request to '/users/wishlist' backend endpoint with 'productId' as the request body, the request must look for data being an array of strings
            return data.wishlist; // return the data that comes from the backend server
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }), // once the mutation is successful, clear the 'wishlist' query from the query cache to refetch the data
    });

    const removeFromWishlistMutation = useMutation({ // create an instance of 'useMutation' hook for DELETE request
        mutationFn: async (productId: string) => { //'mutationFn' is the function that will be called when the mutation is triggered
            // it takes unique ID of product as an argument which is of type'string'
            const { data } = await api.delete<{ wishlist: string[] }>(`/users/wishlist/${productId}`);
            // make a DELETE request to '/users/wishlist/${productId}' backend endpoint, the request must look for data being an array of strings
            return data.wishlist;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }), // once the mutation is successful, clear the 'wishlist' query from the query cache to refetch the data
    });

    const isInWishlist = (productId: string) => { // create a function to check if a product is in the wishlist, it takes unique ID of product as an argument which is of type'string'
        return wishlist?.some((product) => product._id === productId) ?? false; // iterate over 'wishlist' array and for each product, check if it's unique ID is equal to product ID provided as argument
        // if yes, return true, else return false, if 'wishlist' is undefined ie doesn't exist, return false
    };

    const toggleWishlist = (productId: string) => { // create a function to toggle the wishlist action, it takes unique ID of product as an argument which is of type'string'
        // if given product ID is in the wishlist, remove it from the wishlist, otherwise, add it to the wishlist
        if (isInWishlist(productId)) {
            removeFromWishlistMutation.mutate(productId);
        } else {
            addToWishlistMutation.mutate(productId);
        }
    };

    return {
        // return 'wishlist' array (empty array if it doesn't exist), 'isLoading' flag (true if data is being fetched), 'isError' flag (true if there was an error while fetching the data)
        // 'wishlistCount' which is the number of products in the wishlist, 'isInWishlist' which is a function to check if a product is in the wishlist, 'toggleWishlist' which is a function to toggle the wishlist action
        wishlist: wishlist || [],
        isLoading,
        isError,
        wishlistCount: wishlist?.length || 0,
        isInWishlist,
        toggleWishlist,
        // 'mutate' methods of all the instances of 'useMutation' to actually execute the mutations
        addToWishlist: addToWishlistMutation.mutate,
        removeFromWishlist: removeFromWishlistMutation.mutate,
        // 'isPending' states of all the instances of 'useMutation' to indicate whether the mutation is in progress or not
        isAddingToWishlist: addToWishlistMutation.isPending,
        isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    };
};

export default useWishlist;