import { useQuery } from "@tanstack/react-query"; // from tanstack library, import 'useQuery' hook to make fetch requests to the backend
import { orderApi, statsApi } from "../lib/api"; // import 'orderApi' and 'statsApi' to get order data and dashboard statistics from backend
import { DollarSignIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import { capitalizeText, formatDate, getOrderStatusBadge } from "../lib/utils";

function DashboardPage() {
    const { data: ordersData, isLoading: ordersLoading } = useQuery({ // create an instance of 'useQuery' hook that takes 'data' under the name 'ordersData'
        // and 'isLoading' state under the name 'ordersLoading' to tell whether the data is still being fetched or not
        queryKey: ["orders"], // 'orders' is the unique identifier of this instance
        queryFn: orderApi.getAll, // 'queryFn' is the function that will fetch the data using 'getAll' function of 'orderApi' object
    });

    const { data: statsData, isLoading: statsLoading } = useQuery({ // create an instance of 'useQuery' hook that takes 'data' under the name 'statsData'
        // and 'isLoading' state under the name 'statsLoading' to tell whether the data is still being fetched or not
        queryKey: ["dashboardStats"], // 'dashboardStats' is the unique identifier of this instance
        queryFn: statsApi.getDashboard, // 'queryFn' is the function that will fetch the data using 'getDashboard' function of 'statsApi' object
    });

    const recentOrders = ordersData?.orders?.slice(0, 5) || []; // get first 5 elements of 'orders' array of 'ordersData' object (empty array if not found)

    const statsCards = [ // array of objects that contain data for each stat card
        {
            name: "Total Revenue",
            value: statsLoading ? "..." : `$${statsData?.totalRevenue?.toFixed(2) || 0}`, // if value of 'statsLoading' is true, display '...' else display value of'statsData' object's 'totalRevenue' property ie total revenue fixed to 2 decimal places or 0 if not found
            icon: <DollarSignIcon className="size-8" />,
        },
        {
            name: "Total Orders",
            value: statsLoading ? "..." : statsData?.totalOrders || 0, // if value of'statsLoading' is true, display '...' else display value of 'statsData' object's 'totalOrders' property ie total number of orders placed by customers (0 if none)
            icon: <ShoppingBagIcon className="size-8" />,
        },
        {
            name: "Total Customers",
            value: statsLoading ? "..." : statsData?.totalCustomers || 0, // if value of'statsLoading' is true, display '...' else display value of'statsData' object's 'totalCustomers' property ie total number of customers (0 if none)
            icon: <UsersIcon className="size-8" />,
        },
        {
            name: "Total Products",
            value: statsLoading ? "..." : statsData?.totalProducts || 0, // if value of'statsLoading' is true, display '...' else display value of'statsData' object's 'totalProducts' property ie total number of products (0 if none)
            icon: <PackageIcon className="size-8" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
                {statsCards.map((stat) => ( // iterate over 'statsCards' array as 'stat'
                    <div key={stat.name} className="stat"> {/* value of 'name' property is the unique identifier of current container */}
                        {/* render icon, name and value */}
                        <div className="stat-figure text-primary">{stat.icon}</div>
                        <div className="stat-title">{stat.name}</div>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Recent Orders</h2>

                    {ordersLoading ? ( // if value of 'ordersLoading' is true ie orders are being fetched, display loading spinner
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recentOrders.length === 0 ? ( // if orders are fetched but no orders are found, display message that no orders are found
                        <div className="text-center py-8 text-base-content/60">No orders yet</div>
                    ) : ( // otherwise, display table of recent orders
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map((order) => ( // iterate over 'recentOrders' array as 'order'
                                        <tr key={order._id}> {/* value of '_id' property is the unique identifier of current row */}
                                            <td>
                                                <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span> {/* render last 8 characters of order's unique ID in upper case */}
                                            </td>

                                            <td>
                                                <div>
                                                    <div className="font-medium">{order.shippingAddress.fullName}</div> {/* render full name of person who is ordering from 'shippingAddress' property of 'order' object  */}
                                                    <div className="text-sm opacity-60">
                                                        {order.orderItems.length} item(s) {/* render the number of elements in 'orderItems' array of 'order' object */}
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="text-sm">
                                                    {order.orderItems[0]?.name} {/* render the name of first item in the order */}
                                                    {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`} {/* render the number of other items in cart if they exist */}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="font-semibold">${order.totalPrice.toFixed(2)}</span> {/* render the total price of all products in the cart fixed to 2 decimal places */}
                                            </td>

                                            <td>
                                                <div className={`badge ${getOrderStatusBadge(order.status)}`}> {/* get order status badge to apply appropriate color */}
                                                    {capitalizeText(order.status)} {/* render order status with first letter capitalized using 'capitalizeText' function */}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span> {/* render the date at which order was created, formatted in the desired format using 'formatDate' function */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;