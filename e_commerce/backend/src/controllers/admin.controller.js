import cloudinary from "../config/cloudinary.js"; // import configured cloudinary instance to work with it
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req, res) { // create a function to create a new product that takes user request and function response objects as parameters
    try {
        const { name, description, price, stock, category } = req.body; // acquire product name, description, price, stock/quantity, and category from the request body

        if (!name || !description || !price || !stock || !category) return res.status(400).json({ message: "All fields are required" });
        // if any of the required fields are missing, return an error response with a 400 status code and a message indicating that all fields are required

        if (!req.files || req.files.length === 0) return res.status(400).json({ message: "At least one image is required" });
        // if no images are uploaded, return an error response with a 400 status code and a message indicating that at least one image is required to be given/uploaded

        if (req.files.length > 3) return res.status(400).json({ message: "Maximum 3 images allowed" });
        // if more than 3 images are uploaded, return an error response with a 400 status code and a message indicating that at max 3 images are allowed to be given/uploaded

        // iterate over each uploaded image file and create promises to upload them to 'products' folder in cloudinary
        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        });

        const uploadResults = await Promise.all(uploadPromises); // execute all promises to upload files in 'products' folder in cloudinary and store all
        // result objects after uploading the files in an array called 'uploadResults'

        const imageUrls = uploadResults.map((result) => result.secure_url); // iterate over result objects of uploaded images, extract their secure URLs and store them in an array called 'imageUrls'

        const product = await Product.create({ // create a new product object/document named 'product' and insert it in 'Product' collection which contains the following properties
            name, // name of product
            description, // description of product
            price: parseFloat(price), // price of product in decimal format
            stock: parseInt(stock), // stock/quantity of product in integer format
            category, // category of product
            images: imageUrls, // array of URLs of uploaded images
        });

        res.status(201).json(product); // return the object/document of created product as a JSON object with a 201 status code
    } catch (error) { // if any error occurs while creating the product and inserting it in the collection
        console.error("Error creating product", error); // log the error message to the console to understand the cause of error
        res.status(500).json({ message: "Internal server error" }); // return 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export async function getAllProducts(_, res) { // create a function to fetch all products from the database, it takes only response object as parameter to send response to user
    // but it doesn't take any request object as parameter because it doesn't need any data from user to fetch all products since we are not taking any specific product
    try {
        // extract all documents from 'Product' collection and sort them in descending order based on their 'createdAt' property to get the latest products first and return them in JSON format as response
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) { // if any error occurs while getting all products from the collection
        console.error("Error getting all products: ", error); // log the error message to the console to understand the cause of error
        res.status(500).json({ message: "Internal server error" }); // return 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export async function updateProduct(req, res) { // create a function to update a product's information, it takes user request and function response objects as parameters
    try {
        const { id } = req.params; // extract product's unique ID to know which product to update
        const { name, description, price, stock, category } = req.body; // extract product's updated details from the request body, it takes all details of product, even those not actually updated

        const product = await Product.findById(id); // find the product in the database's 'Product' collection by it's unique ID
        if (!product) return res.status(404).json({ message: "Product not found" }); // if 'product' object remains null, it means that no user with this unique ID exists
        // in this case, return a 404 status code and a JSON object containing message that product could not be found

        // if user actually provided any updated details for the product, update the product's details in the database
        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;

        if (req.files && req.files.length > 0) { // if user has uploaded any new images for the product
            if (req.files.length > 3) return res.status(400).json({ message: "Maximum 3 images allowed" }); // if user uploaded more than 3 images
            // return a 400 status code and a JSON object containing message indicating that at max 3 images are allowed to be given/uploaded

            // create an array of promises that map over provided updated files and upload them to 'products' folder
            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
            });

            const uploadResults = await Promise.all(uploadPromises); // execute all promises to upload files in 'products' folder in cloudinary and store all
            // result objects after uploading the files in an array called 'uploadResults'
            
            product.images = uploadResults.map((result) => result.secure_url); // iterate over result objects of updated images, extract their secure URLs and put them in 'images' property of product to update
        }

        await product.save(); // save the updated product details in the database
        res.status(200).json(product); // return the updated product details as a JSON object with a 200 status code
    } catch (error) { // if any error occurs while updating the product and inserting it in the collection
        console.error("Error updating product", error); // log the error message to the console to understand the cause of error
        res.status(500).json({ message: "Internal server error" }); // return 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export async function getAllOrders(_, res) { // create a function to get all orders from the database, it takes only response object as parameter
    // not user request object because we want to fetch all orders, not any specific one
    try {
        const orders = await Order.find() // fetch all documents from 'Order' collection (by not giving any specific condition to 'find' function)
            .populate("user", "name email") // populate 'user' field of each order with 'name' and 'email' fields of the user who placed the order
            .populate("orderItems.product") // populate 'orderItems' field of each order with 'product' field of each order item
            .sort({ createdAt: -1 }); // sort orders in descending order based on their 'createdAt' property to get the latest orders first

        res.status(200).json({ orders }); // return the array of orders as a JSON object with a 200 status code
    } catch (error) { // if any error occurs while fetching all orders from the database
        console.error("Error in getAllOrders controller:", error); // log the error message to the console to understand the cause of error
        res.status(500).json({ error: "Internal server error" }); // return 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export async function updateOrderStatus(req, res) { // create a function to update the status of an order, it takes user request and function response objects as parameters
    try {
        // get order ID from request parameters and new status from request body
        const { orderId } = req.params;
        const { status } = req.body;

        // if given updated status is not a valid value, return a 400 status code and a JSON object containing message indicating that invalid status is given
        if (!["pending", "shipped", "delivered"].includes(status)) return res.status(400).json({ error: "Invalid status" });

        // find the order from 'Order' collection by its ID, if not found, return a 404 status code and a JSON object containing message indicating that order was not found
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status; // update the order's status to the given value

        if (status === "shipped" && !order.shippedAt) order.shippedAt = new Date(); // if updated status is 'shipped' ie order is shipped for delivery, update 'shippedAt' property of order with current date

        if (status === "delivered" && !order.deliveredAt) order.deliveredAt = new Date(); // if updated status is 'delivered' ie order is delivered, update 'deliveredAt' property of order with current date

        await order.save(); // save the updated order object with updated status in the database

        res.status(200).json({ message: "Order status updated successfully", order }); // return a 200 status code and a JSON object containing message indicating that order status was updated successfully and the updated order object
    } catch (error) { // if any error occurs while updating the order status
        console.error("Error in updating status: ", error); // log the error to the console to understand the cause of error
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export async function getAllCustomers(_, res) { // create a function to get all customers from the database, it takes only response object as parameter
    // not user request object because we want to fetch all customers, not any specific one
    try {
        const customers = await User.find().sort({ createdAt: -1 }); // fetch all documents from 'User' collection (by not giving any specific condition to 'find' function)
        // and sort them in descending order based on their 'createdAt' property to get the latest customers first
        res.status(200).json({ customers }); // return the array of customers as a JSON object with a 200 status code
    } catch (error) { // if any error occurs while fetching all customers from the database
        console.error("Error fetching customers:", error); // log the error to the console to understand the cause of error
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export async function getDashboardStats(_, res) { // create a function to get dashboard statistics from the database, it takes only response object as parameter
    // not user request object because we want to fetch all dashboard statistics, not any specific one
    try {
        const totalOrders = await Order.countDocuments(); // count total number of documents in 'Order' collection ie number of orders of a user

        // aggregate all documents of 'Order' collection and add their 'totalPrice' property values to get total price of all orders
        // '_id: null' means that we are not grouping documents by any field, we are just adding all documents' 'totalPrice' property values
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.total || 0; // extract total revenue from the result object and assign it to 'totalRevenue' variable

        // count total number of documents in 'User' and 'Product' collections ie number of customers and products respectively
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // send total price of all objects and total number of orders, customers, and products as a JSON object with a 200 status code
        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
        });
    } catch (error) { // if any error occurs while fetching dashboard statistics from the database
        console.error("Error fetching dashboard stats: ", error); // log the error to the console to understand the cause of error
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code and a JSON object containing message indicating that an internal server error occurred
    }
}

export const deleteProduct = async (req, res) => { // create a function to delete a product from the database, it takes user request and function response objects as parameters
    try {
        const { id } = req.params; // extract product's unique ID to know which product to delete

        // find the product from 'Product' collection by it's unique ID and if not found, return a 404 status code and a JSON object containing message indicating that product was not found
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.images && product.images.length > 0) { // if product has images, delete them from cloudinary
            const deletePromises = product.images.map((imageUrl) => { // create an array of promises that map over each image URL
                const publicId = "products/" + imageUrl.split("/products/")[1]?.split(".")[0]; // extract image's path/public ID from it's URL
                if (publicId) return cloudinary.uploader.destroy(publicId); // if image's path exists, delete it from cloudinary
            });

            await Promise.all(deletePromises.filter(Boolean)); // execute all promises but before that remove non true values from promises array like null, undefined, etc.
        }

        await Product.findByIdAndDelete(id); // delete the product document from 'Product' collection by it's unique ID
        
        res.status(200).json({ message: "Product deleted successfully" }); // return a 200 status code and a JSON object containing message indicating that product was deleted successfully
    } catch (error) { // if any error occurs while deleting the product from the database
        console.error("Error deleting product:", error); // log the error to the console to understand the cause of error
        res.status(500).json({ message: "Failed to delete product" }); // return a 500 status code and a JSON object containing message indicating that failed to delete product
    }
};