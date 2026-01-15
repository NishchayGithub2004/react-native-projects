import { Product } from "../models/product.model.js";

export async function getProductById(req, res) { // create a function to get product by it's unique ID that takes user request and function response objects as parameters
    try {
        const { id } = req.params; // get product's unique ID from the request parameters
        
        const product = await Product.findById(id); // find product from 'Product' collection by it's unique ID

        if (!product) return res.status(404).json({ message: "Product not found" });
        // if no such product is found, return a 404 status code with a message indicating that the product was not found

        res.status(200).json(product); // if product is found, return a 200 status code with the product object in JSON format containing it's details
    } catch (error) { // if any error occurs while fetching the product by it's unique ID
        console.error("Error fetching product:", error); // log the error to the console to know what error occurred
        res.status(500).json({ message: "Internal server error" }); // return a 500 status code with a message indicating that an internal server error occurred
    }
}