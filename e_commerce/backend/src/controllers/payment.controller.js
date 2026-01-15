import Stripe from "stripe"; // integrate Stripe class from stripe library to integrate stripe payment gateway
import { ENV } from "../config/env.js"; // import 'ENV' object to load environment variables
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY); // create an instance of 'Stripe' class with the secret key from environment variables

export async function createPaymentIntent(req, res) { // create a function to create a payment intent that takes request and response objects as parameters
    try {
        const { cartItems, shippingAddress } = req.body; // take cart items and shipping address from the request body
        
        const user = req.user; // take user from the request object to get the user's information

        if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: "Cart is empty" }); // if cart doesn't exist or is empty
        // return a 400 status code with a JSON object containing error message that cart is empty

        let subtotal = 0; // variable to store subtotal of the order initialized to 0 since initially no items are paid for
        
        const validatedItems = []; // array to store validated items ie items in the cart that are to be ordered

        for (const item of cartItems) { // iterate over each item in the cart
            const product = await Product.findById(item.product._id); // find product by it's unique ID present in 'product' property of item
            
            if (!product) return res.status(404).json({ error: `Product ${item.product.name} not found` }); // if product does not exist, return a 404 status code
            // with a JSON object containing an error message that product was not found

            if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            // if quantity of product in stock is less than quantity of item in cart, return a 400 status code with a JSON object containing an error message that stock is insufficient

            subtotal += product.price * item.quantity; // to 'subtotal', add the product's price multiplied by quantity of item in cart
            
            validatedItems.push({ // now that current product is validated to be set for order, push it's data to 'validatedItems' array including
                // it's unique ID, name, price, quantity, and first image of product
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0],
            });
        }

        const shipping = 10.0; // shipping cost of 10 dollars for now, can be changed later if needed
        const tax = subtotal * 0.08; // calculate tax as 8% of subtotal ie 8% tax
        const total = subtotal + shipping + tax; // calculate total price of product(s) as subtotal plus shipping and tax

        if (total <= 0) return res.status(400).json({ error: "Invalid order total" }); // if total price of product(s) is less than or equal to 0, return a 400 status code

        let customer; // variable to store customer information
        
        if (user.stripeCustomerId) customer = await stripe.customers.retrieve(user.stripeCustomerId); // if user has already a stripe customer ID, retrieve it from stripe customers
        
        // if user does not have a stripe customer ID, create one using it's name and email with metadata containing user's clerk ID and unique ID
        else {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    clerkId: user.clerkId,
                    userId: user._id.toString(),
                },
            });

            await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id }); // update the user's document in the database with the new stripe customer ID
        }

        const paymentIntent = await stripe.paymentIntents.create({ // create a new payment intent containing: amount in cents, currency: usd, customer ID
            // automatic payment methods enabled, metadata containing user's clerk ID, unique ID, order items in JSON, shipping address in JSON, and total price fixed to 2 decimal places
            amount: Math.round(total * 100),
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                clerkId: user.clerkId,
                userId: user._id.toString(),
                orderItems: JSON.stringify(validatedItems),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: total.toFixed(2),
            },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret }); // return a 200 status code with a JSON object containing client secret of payment intent
    } catch (error) { // if any error occurs while creating payment intent
        console.error("Error creating payment intent: ", error); // log the error message to the console to know what error occurred
        res.status(500).json({ error: "Failed to create payment intent" }); // return a 500 status code with a JSON object containing error message that payment intent failed to be created
    }
}

export async function handleWebhook(req, res) { // create a function to handle webhook events that takes request and response objects as parameters
    // webhook events mean that as soon as an event occurs, another set of events happen automatically
    const sig = req.headers["stripe-signature"]; // take stripe signature from the request headers
    
    let event; // let an event object to store the event that occurred

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET); // construct an event object using the request body, signature, and webhook secret extracted from environment variables
    } catch (err) { // if any error occurs while constructing event object
        console.error("Webhook signature verification failed: ", err.message); // log the error message to the console to know what error occurred
        return res.status(400).send(`Webhook Error: ${err.message}`); // return a 400 status code with a message that webhook signature verification failed
    }

    if (event.type === "payment_intent.succeeded") { // if event is that payment succeeded ie user has made the payment
        const paymentIntent = event.data.object; // take payment intent object from the event data object

        console.log("Payment succeeded:", paymentIntent.id); // log the payment intent ID to the console to know that payment succeeded

        try {
            const { userId, clerkId, orderItems, shippingAddress, totalPrice } = paymentIntent.metadata;
            // extract from payment intent metadata, user's ID, clerk ID, items ordered, shipping address, and total price

            const existingOrder = await Order.findOne({ "paymentResult.id": paymentIntent.id });
            // find from 'Order' collection the order for which payment succeeded using payment intent ID
            
            if (existingOrder) { // if payment is already done for the order
                console.log("Order already exists for payment: ", paymentIntent.id); // log the payment intent ID to the console to know that payment is already done for the order
                return res.json({ received: true }); // return a JSON object containing 'received' property set to true showing that payment is done
            }

            const order = await Order.create({ // create a new document in 'Order' collection with user's ID, clerk ID, items ordered in JSON form, shipping address in JSON form,
                // payment result object containing payment intent ID and status set to succeeded since payment is done, and total price fixed to 2 decimal places
                user: userId,
                clerkId,
                orderItems: JSON.parse(orderItems),
                shippingAddress: JSON.parse(shippingAddress),
                paymentResult: {
                    id: paymentIntent.id,
                    status: "succeeded",
                },
                totalPrice: parseFloat(totalPrice),
            });

            const items = JSON.parse(orderItems); // parse order items in JSON format
            
            for (const item of items) { // iterate over each JSON object in 'items' array ie iterate over each order item
                // find the product by it's unique ID and update it's stock by decreasing it's quantity by the quantity ordered
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity },
                });
            }

            console.log("Order created successfully:", order._id); // log the order ID to the console with the message that order was created successfully
        } catch (error) { // if any error occurs while creating order from webhook
            console.error("Error creating order from webhook: ", error); // log the error message to the console to know what error occurred
        }
    }

    res.json({ received: true }); // return a JSON object containing 'received' property set to true showing that webhook event was received successfully
}