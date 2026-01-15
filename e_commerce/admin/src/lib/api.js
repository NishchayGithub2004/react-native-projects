import axiosInstance from "./axios"; // import configured axios instance to make HTTP requests to the backend server

export const productApi = { // create 'productApi' object that contains functions to make product related requests to the backend server
    getAll: async () => { // function to get all products from the backend server
        const { data } = await axiosInstance.get("/admin/products"); // make GET request to '/admin/products' endpoint
        return data; // return response data object
    },

    create: async (formData) => { // function to create a new product on the backend server, takes form data in object form as parameter
        const { data } = await axiosInstance.post("/admin/products", formData); // make POST request to '/admin/products' endpoint with form data as input data
        return data; // return response data object
    },

    update: async ({ id, formData }) => { // function to update an existing product on the backend server,
        // it takes ID of product to update and form data containing updated information in object form as parameters
        const { data } = await axiosInstance.put(`/admin/products/${id}`, formData); // make PUT request to '/admin/products/:id' endpoint with updated form data as input data
        return data; // return response data object
    },

    delete: async (productId) => { // function to delete a product from the backend server, takes ID of product to delete as parameter
        const { data } = await axiosInstance.delete(`/admin/products/${productId}`); // make DELETE request to '/admin/products/:id' endpoint
        return data; // return response data object
    },
};

export const orderApi = { // create 'orderApi' object that contains functions to make order related requests to the backend server
    getAll: async () => { // function to get all orders from the backend server
        const { data } = await axiosInstance.get("/admin/orders"); // make GET request to '/admin/orders' endpoint
        return data; // return response data object
    },

    updateStatus: async ({ orderId, status }) => { // function to update status of an existing order on the backend server,
        // it takes ID of order to update and new status of order as parameters
        const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
        // make PATCH request to '/admin/orders/:id/status' endpoint with new status as input data
        return data; // return response data object
    },
};

export const statsApi = { // create 'statsApi' object that contains functions to make statistics related requests to the backend server
    getDashboard: async () => { // function to get dashboard statistics from the backend server
        const { data } = await axiosInstance.get("/admin/stats"); // make GET request to '/admin/stats' endpoint
        return data; // return response data object
    },
};

export const customerApi = { // create 'customerApi' object that contains functions to make customer related requests to the backend server
    getAll: async () => { // function to get all customers from the backend server
        const { data } = await axiosInstance.get("/admin/customers"); // make GET request to '/admin/customers' endpoint
        return data; // return response data object
    },
};