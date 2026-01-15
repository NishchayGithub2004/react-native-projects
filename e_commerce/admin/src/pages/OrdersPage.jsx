import { orderApi } from "../lib/api"; // import 'orderApi' to fetch order data from the backend
import { formatDate } from "../lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // from tanstack library, import the followin hooks:
// 'useMutation' to perform write operations like POST, PUT, DELETE, PATCH to create, update and delete data and handle side effects
// 'useQuery' to perform read operations like GET to fetch data and handle side effects, 'useQueryClient' to interact manually with the fetched data

function OrdersPage() {
    const queryClient = useQueryClient(); // create an instance of 'useQueryClient' hook to manually interact with the fetched data

    const { data: ordersData, isLoading } = useQuery({ // create an instance of 'useQuery' hook to fetch order data from the backend which takes 'data' under the name 'ordersData' and 'isLoading' state under the name 'isLoading' to tell whether the data is still being fetched or not
        queryKey: ["orders"], // 'queryKey' is the unique identifier of this instance
        queryFn: orderApi.getAll, // 'queryFn' is the function that will fetch the data using 'getAll' function of 'orderApi' object
    });

    const updateStatusMutation = useMutation({ // create an instance of 'useMutation' hook to update order status
        mutationFn: orderApi.updateStatus, // 'mutationFn' is the function that will update the status using 'updateStatus' function of 'orderApi' object
        onSuccess: () => { // callback function that will be called when the mutation is successful
            // invalidate the cache of 'orders' and 'dashboardStats' queries to refetch the data
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        },
    });

    const handleStatusChange = (orderId, newStatus) => { // create a function named 'handleStatusChange' that takes unique ID of product and new status as arguments
        // call the 'mutate' method of 'updateStatusMutation' instance to update the status of the order
        updateStatusMutation.mutate({ orderId, status: newStatus });
    };

    const orders = ordersData?.orders || []; // get the 'orders' array from 'ordersData' object (empty array if not found)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-base-content/70">Manage customer orders</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {isLoading ? ( // if 'isLoading' state is true, display loading spinner
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : orders.length === 0 ? ( // if 'orders' array is empty, display message
                        <div className="text-center py-12 text-base-content/60">
                            <p className="text-xl font-semibold mb-2">No orders yet</p>
                            <p className="text-sm">Orders will appear here once customers make purchases</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map((order) => { // iterate over 'orders' array as 'order'
                                        const totalQuantity = order.orderItems.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0
                                        ); // determine total quantity of items in the order

                                        return (
                                            <tr key={order._id}> {/* unique ID of order is the unique identifier of the row */}
                                                <td>
                                                    <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span> {/* render last 8 characters of unique ID of the order, all capitalized */}
                                                </td>

                                                <td>
                                                    <div className="font-medium">{order.shippingAddress.fullName}</div> {/* render full name of the person who is ordering */}
                                                    <div className="text-sm opacity-60">
                                                        {order.shippingAddress.city}, {order.shippingAddress.state} {/* render city and state of order */}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="font-medium">{totalQuantity} items</div> {/* render total number of items in the cart */}
                                                    <div className="text-sm opacity-60">
                                                        {order.orderItems[0]?.name} {/* render name of first item in the order */}
                                                        {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`} {/* render number of remaining items if they exist */}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="font-semibold">${order.totalPrice.toFixed(2)}</span> {/* render total price of all items in order in USD fixed to 2 decimal places */}
                                                </td>

                                                <td>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        // selecting any option calls 'handleStatusChange' function with unique ID of order and selected value as arguments
                                                        className="select select-sm"
                                                        disabled={updateStatusMutation.isPending} // disable the select element if the mutation is in progress
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                    </select>
                                                </td>

                                                <td>
                                                    <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span> {/* render the date at which order was created in desired format using 'formatDate' function */}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrdersPage;