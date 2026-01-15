export interface Product { // create an interface that describes the structure of a product
    // it includes: unique ID, name, description, price, amount of that product in stock, category, array of image URLs, average rating,
    // total number of reviews given to that product, timestamps at which the product was created (inserted in database) and/or it's information was updated
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    averageRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
}

export interface User { // create an interface that describes the structure of a user
    // it includes: unique ID, clerk ID, email, name, image URL, array of addresses at which product can be shipped, array of unique IDs of products that are in user's wishlist,
    // timestamps at which the user was created (inserted in database) and/or it's information was updated
    _id: string;
    clerkId: string;
    email: string;
    name: string;
    imageUrl: string;
    addresses: Address[];
    wishlist: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Address { // create an interface that describes the structure of an address
    // it includes: unique ID, label, full name, street address, city, state, zip code, phone number, boolean flag that describes 
    // whether this address is the default one ie address at which product should be shipped by default or not
    _id: string;
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    isDefault: boolean;
}

export interface Order { /* create an interface that describes the structure of an order
    it includes: unique order ID, user who placed the order, clerk ID of the user who placed the order, array of items in the order,
    shipping address which is an object that contains: full name of the person who will receive the product, street address, city, state, zip code, and phone number
    payment result which is an object that contains: payment ID and payment status, total price of the order, order status which can have one of three values: pending, shipped, and delivered, 
    boolean flag that describes whether the order has been reviewed or not, and dates at which the order was created (inserted in database) and/or it's information was updated */
    _id: string;
    user: string;
    clerkId: string;
    orderItems: OrderItem[];
    shippingAddress: {
        fullName: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
    };
    paymentResult: {
        id: string;
        status: string;
    };
    totalPrice: number;
    status: "pending" | "shipped" | "delivered";
    hasReviewed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem { // create an interface that describes the structure of an order item,
    // it includes: unique ID of product, the product described by 'Product' interface, name, price, quantity, and URL of order image
    _id: string;
    product: Product;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Review { // create an interface that describes the structure of a review
    // it includes: unique ID of review, ID of product to review, ID of user who is reviewing the product, ID of order, rating of product
    // timestamps at which the review was created (inserted in database) and/or it's information was updated
    _id: string;
    productId: string;
    userId: string | User;
    orderId: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem { // create an interface that describes the structure of a cart item
    // it includes: unique ID of cart item, product described by 'Product' interface, and quantity of that product in cart
    _id: string;
    product: Product;
    quantity: number;
}

export interface Cart { // create an interface that describes the structure of a cart
    // it includes: unique ID of cart, user who owns the cart, clerk ID of the user who owns the cart, array of cart items, timestamps at which the cart was created (inserted in database) and/or it's information was updated
    _id: string;
    user: string;
    clerkId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}