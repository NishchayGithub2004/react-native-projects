import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // from tanstack library, import the followin hooks:
// 'useMutation' to perform write operations like POST, PUT, DELETE, PATCH to create, update and delete data and handle side effects
// 'useQuery' to perform read operations like GET to fetch data and handle side effects, 'useQueryClient' to interact manually with the fetched data
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make HTTP requests to the backend server
import { Address } from "@/types";

export const useAddresses = () => { // create and export a custom hook called 'useAddresses'
    const api = useApi(); // create an instance of 'useApi' hook to make HTTP requests to the backend server
    
    const queryClient = useQueryClient(); // create an instance of 'useQueryClient' hook to interact manually with the fetched data

    const { // following three things are to be extracted from 'useQuery' hook
        data: addresses, // data under the name 'addresses'
        isLoading, // 'isLoading' which is a boolean value to indicate whether the data is being fetched or not
        isError, // 'isError' which is a boolean value to indicate whether there was an error while fetching the data or not
    } = useQuery({ // useQuery hook is used to fetch data from the backend server
        queryKey: ["addresses"], // 'queryKey' is a unique identifier for the query, here it is 'addresses'
        queryFn: async () => { // 'queryFn' is the function that will fetch the data from the backend server (cannot be renamed since it is a property of useQuery hook)
            const { data } = await api.get<{ addresses: Address[] }>("/users/addresses"); // make a GET request to '/users/addresses' backend endpoint
            // typescript type annotation is also given that data to fetch at this endpoint is an array of addresses, each address being an instance of 'Addresses' interface
            return data.addresses; // return the data from the backend server
        },
    });

    const addAddressMutation = useMutation({ // create an instance of 'useMutation' hook for POST request
        mutationFn: async (addressData: Omit<Address, "_id">) => { // 'mutationFn' is the function that will be called when the mutation is triggered
            // it takes 'addressData' as an argument which is of type 'Address' interface but without the '_id' property
            const { data } = await api.post<{ addresses: Address[] }>("/users/addresses", addressData);
            // make a POST request to '/users/addresses' backend endpoint with 'addressData' as the request body, the request must look for data having custom type 'Address'
            return data.addresses; // return the data that comes from the backend server
        },
        onSuccess: () => { // once the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["addresses"] }); // clear the 'addresses' query from the query cache to refetch the data
        },
    });

    const updateAddressMutation = useMutation({ // create an instance of 'useMutation' hook for PUT request
        mutationFn: async ({ // 'mutationFn' is the function that will be called when the mutation is triggered
            // it takes 'addressId' and 'addressData' as arguments, 'addressId' is of type 'string' and 'addressData' is of type 'Address' interface
            // but all it's properties are optional to have values because of 'Partial'
            addressId,
            addressData,
        }: {
            addressId: string;
            addressData: Partial<Address>;
        }) => {
            // make a PUT request to '/users/addresses/${addressId}' backend endpoint with 'addressData' as updated data of custom type 'Address'
            const { data } = await api.put<{ addresses: Address[] }>(
                `/users/addresses/${addressId}`,
                addressData
            );
            return data.addresses; // return the data that comes from the backend server
        },
        onSuccess: () => { // once the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["addresses"] }); // clear the 'addresses' query from the query cache to refetch the data
        },
    });

    const deleteAddressMutation = useMutation({ // create an instance of 'useMutation' hook for DELETE request
        mutationFn: async (addressId: string) => { //'mutationFn' is the function that will be called when the mutation is triggered
            // it takes 'addressId' as an argument which is of type 'string'
            const { data } = await api.delete<{ addresses: Address[] }>(`/users/addresses/${addressId}`);
            // make a DELETE request to '/users/addresses/${addressId}' backend endpoint, the request must look for data having custom type 'Address'
            return data.addresses; // return the data that comes from the backend server
        },
        onSuccess: () => { // once the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["addresses"] }); // clear the 'addresses' query from the query cache to refetch the data
        },
    });

    return {
        // 'addresses' data (empty array if data not available), 'isLoading' flag (true if data is being fetched), 'isError' flag (true if there was an error while fetching the data)
        addresses: addresses || [],
        isLoading,
        isError,
        // 'mutate' methods of all the instances of 'useMutation' to actually execute the mutations
        addAddress: addAddressMutation.mutate,
        updateAddress: updateAddressMutation.mutate,
        deleteAddress: deleteAddressMutation.mutate,
        // 'isPending' states of all the instances of 'useMutation' to indicate whether the mutation is in progress or not
        isAddingAddress: addAddressMutation.isPending,
        isUpdatingAddress: updateAddressMutation.isPending,
        isDeletingAddress: deleteAddressMutation.isPending,
    };
};