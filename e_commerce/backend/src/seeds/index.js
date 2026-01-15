// in this file, a function named 'seedDatabase' is defined which will be used to seed the database with sample data
// to do so, open windows CMD, go to backend folder by writing 'cd backend' and run the command 'npm run seed:products'

import mongoose from "mongoose"; // import mongoose package to work with mongodb
import { Product } from "../models/product.model.js"; // import Product model since we want to seed data into it
import { ENV } from "../config/env.js"; // import ENV object from env.js file to load URL of mongoDB database using environment variable

// define an array of objects representing sample products to seed into the database
const products = [
    {
        name: "Wireless Bluetooth Headphones",
        description:
            "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and travelers.",
        price: 149.99,
        stock: 50,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
        ],
        averageRating: 4.5,
        totalReviews: 128,
    },
    {
        name: "Smart Watch Series 5",
        description:
            "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications and apps on your wrist.",
        price: 299.99,
        stock: 35,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
        ],
        averageRating: 4.7,
        totalReviews: 256,
    },
    {
        name: "Leather Crossbody Bag",
        description:
            "Handcrafted genuine leather bag with adjustable strap. Features multiple compartments and elegant design perfect for daily use.",
        price: 89.99,
        stock: 25,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
        ],
        averageRating: 4.3,
        totalReviews: 89,
    },
    {
        name: "Running Shoes - Pro Edition",
        description:
            "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for performance and comfort during long runs.",
        price: 129.99,
        stock: 60,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
        ],
        averageRating: 4.6,
        totalReviews: 342,
    },
    {
        name: "Bestselling Mystery Novel",
        description:
            "A gripping psychological thriller that will keep you on the edge of your seat. New York Times bestseller with over 1 million copies sold.",
        price: 24.99,
        stock: 100,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
        ],
        averageRating: 4.8,
        totalReviews: 1243,
    },
    {
        name: "Portable Bluetooth Speaker",
        description:
            "Waterproof wireless speaker with 360-degree sound, 12-hour battery life, and durable design. Perfect for outdoor adventures.",
        price: 79.99,
        stock: 45,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
            "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
        ],
        averageRating: 4.4,
        totalReviews: 167,
    },
    {
        name: "Classic Denim Jacket",
        description:
            "Timeless denim jacket with vintage wash and comfortable fit. A wardrobe essential that pairs perfectly with any outfit.",
        price: 69.99,
        stock: 40,
        category: "Fashion",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500",
        ],
        averageRating: 4.2,
        totalReviews: 95,
    },
    {
        name: "Yoga Mat Pro",
        description:
            "Extra-thick non-slip yoga mat with carrying strap. Eco-friendly material provides excellent cushioning and grip for all yoga styles.",
        price: 49.99,
        stock: 75,
        category: "Sports",
        images: [
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
            "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500",
        ],
        averageRating: 4.5,
        totalReviews: 203,
    },
    {
        name: "Mechanical Keyboard RGB",
        description:
            "Gaming keyboard with customizable RGB lighting, mechanical switches, and programmable keys. Built for gamers and typing enthusiasts.",
        price: 119.99,
        stock: 30,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
        ],
        averageRating: 4.7,
        totalReviews: 421,
    },
    {
        name: "Coffee Table Book Collection",
        description:
            "Stunning photography book featuring architecture and design from around the world. Hardcover edition with 300+ pages of inspiration.",
        price: 39.99,
        stock: 55,
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
        ],
        averageRating: 4.6,
        totalReviews: 134,
    },
];

const seedDatabase = async () => { // create a function named 'seedDatabase' to seed the database with sample data
    try {
        await mongoose.connect(ENV.DB_URL); // connect to desired mongodb database using environment variable containing it's URL
        console.log("Connected to MongoDB"); // log a message to the console to indicate that connection was successful

        // delete all existing products from the database and log a message to the console to indicate that all existing products have been deleted
        await Product.deleteMany({});
        console.log("Cleared existing products");

        // insert all objects from the 'products' array into the database and log a message to the console to indicate that all products have been 
        // successfully seeded and show the number of collections/objects added
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products`);

        // create a set named 'categories' which contains unique values of 'category' property from each object in the 'products' array
        // ie it only contains unique item categories name so if there are 2 or more tech items in seeded data, category would contain 'tech' only once
        // then log seeded data's summary to the console including total objects/products seeded and unique categories names separated by commas
        const categories = [...new Set(products.map((p) => p.category))];
        console.log("\nSeeded Products Summary:\n");
        console.log(`Total Products: ${products.length}`);
        console.log(`Categories: ${categories.join(", ")}`);
        
        // close the database connection after seeding is done and log a message to the console to indicate that the connection has been closed
        // and exit the process with code 0 to indicate successful execution
        await mongoose.connection.close();
        console.log("\nDatabase seeding completed and connection closed");
        process.exit(0);
    } catch (error) { // if any error occurs during seeding, log the error message to the console and exit the process with code 1 to indicate an error
        console.error("Error seeding database: ", error);
        process.exit(1);
    }
};

seedDatabase(); // call the 'seedDatabase' function to start seeding the database with sample data as soon as this file is executed