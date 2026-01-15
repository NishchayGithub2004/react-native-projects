import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res) { // create a function to create an order that takes a user request and function response object as parameter
    try {
        const user = req.user; // get the user from the request object
        
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body; // from request body, get order items, shipping address, payment result and total price

        if (!orderItems || orderItems.length === 0) return res.status(400).json({ error: "No order items" });
        // if order items is empty or not provided, return a 400 status code with JSON object with error message that no order items exist

        for (const item of orderItems) { // iterate over items to order
            const product = await Product.findById(item.product._id); // get the product from list of items from the database by it's unique ID
            
            if (!product) return res.status(404).json({ error: `${item.name} not found` });
            // if product is not found, return a 404 status code with JSON object with error message that product does not exist
            
            if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock` });
            // if number of products in stock is less than number of items to order, return a 400 status code with JSON object with error message of insufficient stock
        }

        // insert new order in 'Order' collection with user ID, clerk ID, order items, shipping address, payment result and total price as properties
        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
        });

        for (const item of orderItems) { // iterate over items to order
            await Product.findByIdAndUpdate(item.product._id, { // find product by it's unique ID and update it in 'items' array
                $inc: { stock: -item.quantity }, // decrement quantity of stock by number of items to order
            });
        }

        res.status(201).json({ message: "Order created successfully", order }); // return a 201 status code with JSON object with success message and order object
    } catch (error) { // if an error occurs while creating an order
        console.error("Error in creating order: ", error); // log the error to the console to know what error occurred
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code with JSON object with error message that internal server error occurred
    }
}

export async function getUserOrders(req, res) { // create a function to get orders of a user that takes a user request and function response object as parameters
    try {
        const orders = await Order.find({ clerkId: req.user.clerkId }) // find orders in 'Order' collection where clerk ID matches the clerk ID of the user
            .populate("orderItems.product") // populate 'product' array of 'orderItems' property with order details
            .sort({ createdAt: -1 }); // sort orders in descending order of creation date to get latest orders first

        const orderIds = orders.map((order) => order._id); // create an array of order IDs
        
        const reviews = await Review.find({ orderId: { $in: orderIds } }); // find reviews in 'Review' collection for orders with order ID present in 'orderIds' array
        
        const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString())); // create a set of unique order IDs of orders that have been reviewed by the user

        const ordersWithReviewStatus = await Promise.all( // create an array of promises to execute in parallel
            orders.map(async (order) => { // iterate over 'orders' array ie orders made by the user
                return {
                    ...order.toObject(), // copy all properties of 'order' object to a new object
                    hasReviewed: reviewedOrderIds.has(order._id.toString()), // add a new property 'hasReviewed' to the new object with value 'true' if order ID is present in 'reviewedOrderIds' ie user has reviewed the order, else 'false' ie user has not reviewed the order
                };
            })
        );

        res.status(200).json({ orders: ordersWithReviewStatus }); // return a 200 status code with JSON object containing orders array with review status
    } catch (error) { // if any error occurs while getting orders of a user
        console.error("Error in getting orders of a user: ", error); // log the error to the console to know what error occurred
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code with JSON object with error message that internal server error occurred
    }
}