import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req, res) { // create a function to create a review for a product, takes user request and function response object as parameters
    try {
        const { productId, orderId, rating } = req.body; // extract product and order's unique ID, and rating from the request body

        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5" });
        // if rating is not given, or is less than 1 or greater than 5, return a 400 status code with an error message that rating must be b/w 1 and 5

        const user = req.user; // get user data from request object

        const order = await Order.findById(orderId); // find order from 'Order' collection by it's unique ID
        
        if (!order) return res.status(404).json({ error: "Order not found" }); // if order is not found, return a 404 status code with an error message that order was not found

        if (order.clerkId !== user.clerkId) return res.status(403).json({ error: "Not authorized to review this order" });
        // if order's clerk ID does not match user's clerk ID, return a 403 status code with an error message that user is not authorized to review this order

        if (order.status !== "delivered") return res.status(400).json({ error: "Can only review delivered orders" });
        // if order's status is not 'delivered', return a 400 status code with an error message that user can only review delivered orders

        const productInOrder = order.orderItems.find((item) => item.product.toString() === productId.toString());
        // from 'orderItems' array of order object, find the product whose product ID matches the given product ID
        
        if (!productInOrder) return res.status(400).json({ error: "Product not found in this order" });
        // if no such product in order is found, return a 400 status code with an error message that product was not found in this order

        const review = await Review.findOneAndUpdate( // find the review in 'Review' collection to update it
            { productId, userId: user._id }, // find it by it's product ID and user ID which is user's unique ID
            { rating, orderId, productId, userId: user._id }, // update it with given rating, order ID, product ID, and user ID 
            { new: true, upsert: true, runValidators: true } // return updated document, create one if it doesn't exist, enforce schema validation on new document created
        );

        const reviews = await Review.find({ productId }); // find the reviews from 'Review' collection by it's product ID
        
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0); // calculate total rating by adding all review's rating
        
        const updatedProduct = await Product.findByIdAndUpdate( // find te product by unique ID 'productId' and update it
            productId,
            {
                averageRating: totalRating / reviews.length, // calculate average rating by dividing total rating by number of reviews
                totalReviews: reviews.length, // set total reviews to number of reviews
            },
            { new: true, runValidators: true } // return updated document, enforce schema validation on new document created
        );

        if (!updatedProduct) { // if product was not updated ie review field was not added to it
            await Review.findByIdAndDelete(review._id); // delete the review from 'Review' collection by it's unique ID
            return res.status(404).json({ error: "Product not found" }); // return a 404 status code with an error message that product was not found
        }

        res.status(201).json({ message: "Review submitted successfully", review }); // return a 201 status code with a JSON object containing message that review was submitted successfully and review object
    } catch (error) { // if any error occurs while updating reviews of product
        console.error("Error in creating review: ", error); // log error message to console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code with a JSON object having message that internal server error occured
    }
}

export async function deleteReview(req, res) { // create a function to delete a review, takes user request and function response object as parameters
    try {
        const { reviewId } = req.params; // extract review's unique ID from request parameters

        const user = req.user; // extract user who is requesting to delete review

        const review = await Review.findById(reviewId); // find review from 'Review' collection by it's unique ID
        
        if (!review) return res.status(404).json({ error: "Review not found" }); // if review is not found, return a 404 status code with a JSON object containing error message that review was not found

        if (review.userId.toString() !== user._id.toString()) return res.status(403).json({ error: "Not authorized to delete this review" });
        // if review's user ID does not match user's ID, return a 403 status code with a JSON object containing error message that user is not authorized to delete this review

        const productId = review.productId; // get product ID of product to whom review is given
        
        await Review.findByIdAndDelete(reviewId); // find review from 'Review' collection by it's unique ID and delete it

        const reviews = await Review.find({ productId }); // find all reviews from 'Review' collection by product's ID ie find all reviews given to a product
        
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0); // calculate total rating by adding all review's ratings
        
        await Product.findByIdAndUpdate(productId, { // find product from 'Product' collection by it's unique ID and update it
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0, // calculate average rating by dividing total rating by number of reviews, if no reviews found, set average rating to 0
            totalReviews: reviews.length, // set total reviews to number of reviews given to the product
        });

        res.status(200).json({ message: "Review deleted successfully" }); // return a 200 status code with a JSON object containing message that review was deleted successfully
    } catch (error) { // if any error occurs while deleting review
        console.error("Error occurred while deleting review: ", error); // log error message to console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // return a 500 status code with a JSON object containing error message that internal server error occured
    }
}