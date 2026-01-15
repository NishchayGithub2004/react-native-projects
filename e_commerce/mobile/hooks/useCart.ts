import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // from tanstack library, import the followin hooks:
// 'useMutation' to perform write operations like POST, PUT, DELETE, PATCH to create, update and delete data and handle side effects
// 'useQuery' to perform read operations like GET to fetch data and handle side effects, 'useQueryClient' to interact manually with the fetched data
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make HTTP requests to the backend server
import { Cart } from "@/types";

const useCart = () => { // create and export a custom hook called 'useCart'
    const api = useApi(); // create an instance of 'useApi' hook to make HTTP requests to the backend server
    
    const queryClient = useQueryClient(); // create an instance of 'useQueryClient' hook to interact manually with the fetched data

    const { // following three things are to be extracted from 'useQuery' hook
        data: cart, // data under the name 'cart'
        isLoading, // 'isLoading' which is a boolean value to indicate whether the data is being fetched or not
        isError, // 'isError' which is a boolean value to indicate whether there was an error while fetching the data or not
    } = useQuery({ // useQuery hook is used to fetch data from the backend server
        queryKey: ["cart"], // 'queryKey' is a unique identifier for the query, here it is 'cart'
        queryFn: async () => { // 'queryFn' is a function that returns the data to be fetched
            const { data } = await api.get<{ cart: Cart }>("/cart"); // make a GET request to '/cart' backend endpoint and look for data having custom type 'Cart'
            return data.cart; // return the data that comes from the backend server
        },
    });

    const addToCartMutation = useMutation({ // create an instance of 'useMutation' hook for POST request
        mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
            // 'mutationFn' is the function that will be called when the mutation is triggered, it takes unique ID of product in string form
            // and quantity of product in number form as arguments, where 'quantity' is optional to have a value and is defined to have a value of 1 if not given
            const { data } = await api.post<{ cart: Cart }>("/cart", { productId, quantity });
            // make a POST request to '/cart' backend endpoint with 'productId' and 'quantity' as the request body, the request must look for data having custom type 'Cart'
            return data.cart; // return the data that comes from the backend server
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }), // once the mutation is successful, invalidate the 'cart' query to refetch the data
    });

    const updateQuantityMutation = useMutation({ // create an instance of 'useMutation' hook for PUT request
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
            // 'mutationFn' is the function that will be called when the mutation is triggered, it takes unique ID of product in string form
            // and quantity of product in number form as arguments
            const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity });
            // make a PUT request to '/cart/${productId}' backend endpoint with 'quantity' as updated data of custom type 'Cart'
            return data.cart; // return the data that comes from the backend server
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }), // once the mutation is successful, invalidate the 'cart' query to refetch the data
    });

    const removeFromCartMutation = useMutation({ // create an instance of 'useMutation' hook for DELETE request (to remove a single item from the cart)
        mutationFn: async (productId: string) => { //'mutationFn' is the function that will be called when the mutation is triggered, it takes unique ID of product in string form as an argument
            const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`); // make a DELETE request to '/cart/${productId}' backend endpoint, the request must look for data having custom type 'Cart'
            return data.cart; // return the data that comes from the backend server
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }), // once the mutation is successful, invalidate the 'cart' query to refetch the data
    });

    const clearCartMutation = useMutation({ // create an instance of 'useMutation' hook for DELETE request (to clear the entire cart)
        mutationFn: async () => { //'mutationFn' is the function that will be called when the mutation is triggered, it doesn't take any arguments
            const { data } = await api.delete<{ cart: Cart }>("/cart"); // make a DELETE request to '/cart' backend endpoint, the request must look for data having custom type 'Cart'
            return data.cart; // return the data that comes from the backend server
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }), // once the mutation is successful, invalidate the 'cart' query to refetch the data
    });

    const cartTotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;
    // find sum of all items in the cart by multiplying the price of each item with its quantity and adding them up, if cart is empty, return 0

    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    // find total number of items in the cart by adding up the quantity of each item, if cart is empty, return 0

    return {
        // 'addresses' data (empty array if data not available), 'isLoading' flag (true if data is being fetched), 
        // 'isError' flag (true if there was an error while fetching the data), total price of items in cart and total items in cart
        cart,
        isLoading,
        isError,
        cartTotal,
        cartItemCount,
        // 'mutate' methods of all the instances of 'useMutation' to actually execute the mutations
        addToCart: addToCartMutation.mutate,
        updateQuantity: updateQuantityMutation.mutate,
        removeFromCart: removeFromCartMutation.mutate,
        clearCart: clearCartMutation.mutate,
        // 'isPending' states of all the instances of 'useMutation' to indicate whether the mutation is in progress or not
        isAddingToCart: addToCartMutation.isPending,
        isUpdating: updateQuantityMutation.isPending,
        isRemoving: removeFromCartMutation.isPending,
        isClearing: clearCartMutation.isPending,
    };
};

export default useCart;