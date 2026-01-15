import { useQuery } from "@tanstack/react-query"; // from tanstack library, import 'useQuery' hook to fetch data
import { customerApi } from "../lib/api"; // import 'customerApi' to fetch data from backend related to customers
import { formatDate } from "../lib/utils"; // import 'formatDate' function to format date in desired format

function CustomersPage() {
    const { data, isLoading } = useQuery({ // extract 'data' ie customers data and 'isLoadint' state to check if data is being fetched or not using 'useQuery' hook's instance
        queryKey: ["customers"], // 'customers' is the name which will act as a unique identifier for this query
        queryFn: customerApi.getAll, // 'queryFn' means query function, it uses 'getAll' function of 'customerApi' object to get data of all customers from backend
    });

    const customers = data?.customers || []; // extract 'customers' array from 'data' object and if 'data' is 'undefined' then set it to an empty array

    return (
        <div className="spacey-6">
            <div>
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-base-content/70 mt-1">
                    {/* render the number of customers ie length of 'customers' array and text based on whether there is one or many customers */}
                    {customers.length} {customers.length === 1 ? "customer" : "customers"} registered
                </p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {isLoading ? ( // render a loading spinner while 'isLoading' is true ie data is being fetched from backend
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : customers.length === 0 ? ( // if data is fetched but there are no customers exist then render a message saying no customers yet
                        <div className="text-center py-12 text-base-content/60">
                            <p className="text-xl font-semibold mb-2">No customers yet</p>
                            <p className="text-sm">Customers will appear here once they sign up</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>Addresses</th>
                                        <th>Wishlist</th>
                                        <th>Joined Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {customers.map((customer) => ( // iterate over 'customers' array as 'customer'
                                        <tr key={customer._id}> {/* customer's unique ID works as unique identifier of table row */}
                                            <td className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary text-primary-content rounded-full w-12">
                                                        {/* render customer's image (name if image not available), take them from 'imageUrl' or 'name' property of current customer */}
                                                        <img
                                                            src={customer.imageUrl}
                                                            alt={customer.name}
                                                            className="w-12 h-12 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-semibold">{customer.name}</div> {/* render customer's name */}
                                            </td>

                                            <td>{customer.email}</td> {/* render customer's email */}

                                            <td>
                                                <div className="badge badge-ghost">
                                                    {customer.addresses?.length || 0} address(es) {/* render number of customer's addresses where product can be delivered (0 if not found) */}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="badge badge-ghost">
                                                    {customer.wishlist?.length || 0} item(s) {/* render number of items in customer's wishlist (0 if not found) */}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="text-sm opacity-60">{formatDate(customer.createdAt)}</span> {/* render the date customer signed-up to this application and format it using 'formatDate' function */}
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

export default CustomersPage;