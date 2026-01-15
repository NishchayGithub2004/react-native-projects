import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req, res) { // create a function to get a cart (or create it if it doesn't exist) that takes user request and function response object as parameters
    try {
        let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate("items.product"); // find a cart from 'Cart' collection where clerkId matches the user's clerkId
        // and populate 'products' inside 'items' array objects with extracted data from 'Product' collection

        if (!cart) { // if no data was found
            const user = req.user; // get user data

            // insert user data into 'Cart' collection with empty 'items' array as initial value since cart is just created so it has no items yet
            // user's unique ID is given to it and it's clerk authentication ID is also given to it
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }

        res.status(200).json({ cart }); // send cart data as a JSON response with HTTP status code 200 (OK)
    } catch (error) { // if an error occurs while getting or creating a cart
        console.error("Error in getting or creating cart: ", error); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send error message of internal server error as a JSON response with HTTP status code 500
    }
}

export async function addToCart(req, res) { // create a function to add an item to a cart that takes user request and function response object as parameters
    try {
        const { productId, quantity = 1 } = req.body; // from request body, take product's unique ID and quantity (if not provided, default to 1)

        // find the product by it's unique ID from 'Product' collection, if it doesn't exist, return a 404 response with a JSON object containing error message that product was not found
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });
        // if quantity of product in stock is less than requested, return a 400 response with a JSON object containing error message that insufficient stock is available

        let cart = await Cart.findOne({ clerkId: req.user.clerkId }); // find a cart from 'Cart' collection where clerkId matches the user's clerkId ie get user's cart

        if (!cart) { // if no data was found
            const user = req.user; // get user data

            // insert user data into 'Cart' collection with empty 'items' array as initial value since cart is just created so it has no items yet
            // user's unique ID is given to it and it's clerk authentication ID is also given to it
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        // find an item in the cart's items array where product ID matches the given productId ie check if product is already in cart or not
        
        if (existingItem) { // if the product is already in the cart
            const newQuantity = existingItem.quantity + quantity; // increment it's quantity by the given quantity
            if (product.stock < newQuantity) return res.status(400).json({ error: "Insufficient stock" });
            // if quantity of product in stock is less than new quantity, return a 400 response with a JSON object containing error message that insufficient stock is available
            existingItem.quantity = newQuantity; // otherwise update the quantity of the item already existing in the stock to the new quantity
        }
        
        else cart.items.push({ product: productId, quantity }); // but if the product is not already in the cart, add it to the cart's 'items' array with the demanded quantity

        await cart.save(); // save the updated cart data to the database

        res.status(200).json({ message: "Item added to cart", cart }); // send a JSON response with HTTP status code 200 and a message indicating that the item was added to the cart along with the updated cart data
    } catch (error) { // if any error occurs while adding the item to the cart
        console.error("Error while adding product to the cart: ", error); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a JSON response with HTTP status code 500 and a message indicating that an internal server error occurred
    }
}

export async function updateCartItem(req, res) { // create a function to update a cart item that takes user request and function response object as parameters
    try {
        // get product's unique ID from request parameters and quantity of item in the cart from request body
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });
        // if quantity is less than 1, return a 400 response with a JSON object containing error message that quantity to update must be at least 1

        // find the cart where clerkId matches the user's clerkId, if cart isn't found, return a 404 response with a JSON object containing error message that cart was not found
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        // find the index of the item in the cart's 'items' array where product ID matches the given productId
        // if index found is -1 ie item is not found in the cart, return a 404 response with a JSON object containing error message that item was not found in the cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

        // find the product by it's unique ID from 'Product' collection, if it doesn't exist, return a 404 response with a JSON object containing error message that product was not found
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });
        // if quantity of product in stock is less than requested, return a 400 response with a JSON object containing error message that insufficient stock is available

        cart.items[itemIndex].quantity = quantity; // update the quantity of the item in the cart to the given quantity

        await cart.save(); // save the updated cart data to the database

        res.status(200).json({ message: "Cart updated successfully", cart }); // send a JSON response with HTTP status code 200 and a message indicating that the cart was updated successfully along with the updated cart data
    } catch (error) { // if any error occurs while updating the cart
        console.error("Error in updating cart item: ", error); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a JSON response with HTTP status code 500 and a message indicating that an internal server error occurred
    }
}

export async function removeFromCart(req, res) { // create a function to remove an item from a cart that takes user request and function response object as parameters
    try {
        const { productId } = req.params; // get product ID from request parameters

        // find the cart where clerkId matches the user's clerkId, if cart isn't found, return a 404 response with a JSON object containing error message that cart was not found
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter((item) => item.product.toString() !== productId); // filter out the item from the cart's 'items' array where product ID matches the given productId
        
        await cart.save(); // save the updated cart data to the database

        res.status(200).json({ message: "Item removed from cart", cart }); // send a JSON response with HTTP status code 200 and a message indicating that the item was removed from the cart along with the updated cart data
    } catch (error) { // if any error occurs while updating the cart
        console.error("Error in updating cart: ", error); // log the error to the console to know what error occured 
        res.status(500).json({ error: "Internal server error" }); // send a JSON response with HTTP status code 500 and a message indicating that an internal server error occurred
    }
}

export const clearCart = async (req, res) => { // create a function to clear a cart that takes user request and function response object as parameters
    try {
        // find the cart where clerkId matches the user's clerkId, if cart isn't found, return a 404 response with a JSON object containing error message that cart was not found
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = []; // make the cart's 'items' array empty
        
        await cart.save(); // save the updated cart data to the database

        res.status(200).json({ message: "Cart cleared", cart }); // send a JSON response with HTTP status code 200 and a message indicating that the cart was cleared along with the updated cart data
    } catch (error) { // if any error occurs while clearing the cart
        console.error("Error in clearCart controller:", error); // log the error to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a JSON response with HTTP status code 500 and a message indicating that an internal server error occurred
    }
};