import { useMutation, useQueryClient } from "@tanstack/react-query";
// from 'tanstack' library, import 'useMutation' hook to create data mutations/changes and 'useQueryClient' hook to interact with query cache
import { useApi } from "@/lib/api"; // import custom hook 'useApi' to make API requests

interface CreateReviewData { // create an interface for review data to be sent to the backend
    productId: string; // unique ID of product in string form
    orderId: string; // unique ID of order in string form
    rating: number; // rating of product in number form
}

export const useReviews = () => { // create a custom hook 'useReviews' to interact with review data
    const api = useApi(); // create an instance of the 'useApi' hook to make API requests
    const queryClient = useQueryClient(); // create an instance of the 'useQueryClient' hook to interact with query cache

    const createReview = useMutation({ // create an instance of 'useMutation' hook to create review data
        mutationFn: async (data: CreateReviewData) => { // 'mutationFn' is the function that will be triggered when the mutation is executed
            // it takes data of type 'CreateReviewData' as argument
            const response = await api.post("/reviews", data); // make a POST request to '/reviews' endpoint with data in argument as body
            return response.data; // return the response data
        },
        onSuccess: () => { // 'callback' function that will be triggered when the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["products"] }); // invalidate the query cache for 'products' to refetch data
            queryClient.invalidateQueries({ queryKey: ["orders"] }); // invalidate the query cache for 'orders' to refetch data
        },
    });

    return {
        isCreatingReview: createReview.isPending, // return 'isPending' state of 'createReview' mutation as 'isCreatingReview' to know if mutation is in progress
        createReviewAsync: createReview.mutateAsync, // return 'mutateAsync' function of 'createReview' mutation as 'createReviewAsync' to actually trigger mutation
    };
};