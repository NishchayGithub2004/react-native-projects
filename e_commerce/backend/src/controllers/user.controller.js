import { User } from "../models/user.model.js";

export async function addAddress(req, res) { // create a function to add user to database, it takes user request and function response objects as parameters
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body;
        // from request body, extract label, full name, street address, city, state, zip code, phone number and boolean flag 'isDefault'

        const user = req.user; // get user object from request object's 'user' property

        if (!fullName || !streetAddress || !city || !state || !zipCode) return res.status(400).json({ error: "Missing required address fields" });
        // if either full name, street address, city, state or zip code is missing, return 400 status code with a JSON object containing error message that required address fields are missing

        if (isDefault) { // if 'isDefault' is provided, set 'isDefault' property of all values of 'addresses' property of 'user' object to false
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        // to 'addresses' property of 'user' object, add a new object with data extracted from request body
        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false,
        });

        await user.save(); // save the updated user object to database

        res.status(201).json({ message: "Address added successfully", addresses: user.addresses }); // send a 201 status code with a JSON object containing message that address was added sucessfully 
        // and also send updated 'addresses' array after adding new object in this JSON
    } catch (error) { // if any error occurs while adding a new address
        console.error("Error occured while adding addresses: ", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}

export async function getAddresses(req, res) { // create a function to get user's addresses from database, it takes user request and function response objects as parameters
    try {
        const user = req.user; // get 'user' object from request object's 'user' property
        res.status(200).json({ addresses: user.addresses }); // send a 200 status code with a JSON object containing 'addresses' array of 'user' object
    } catch (error) { // if any error occurs while getting addresses of a user
        console.error("Error occured while getting addresses: ", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}

export async function updateAddress(req, res) { // create a function to update user's address in database, it takes user request and function response objects as parameters
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body;
        // from request body, extract label, full name, street address, city, state, zip code, phone number and boolean flag 'isDefault'

        const { addressId } = req.params; // get address ID from request object's 'params' property

        const user = req.user; // get 'user' object from request object's 'user' property

        const address = user.addresses.id(addressId); // find address object with given 'addressId' from 'addresses' array of 'user' object
        
        if (!address) return res.status(404).json({ error: "Address not found" }); // if address object with given 'addressId' is not found, return 404 status code with a JSON object containing error message that address was not found

        if (isDefault) { // if 'isDefault' is provided, set 'isDefault' property of all values of 'addresses' property of 'user' object to false
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        // update the properties of 'address' object with updated data extracted from request body
        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save(); // save the updated user object to database

        res.status(200).json({ message: "Address updated successfully", addresses: user.addresses }); // send a 200 status code with a JSON object containing message that address was updated sucessfully
        // and also send updated 'addresses' array after updating object in this JSON
    } catch (error) { // if any error occurs while updating a user's address
        console.error("Error in updating user address: ", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}

export async function deleteAddress(req, res) { // create a function to delete user's address from database, it takes user request and function response objects as parameters
    try {
        const { addressId } = req.params; // get address ID from request object's 'params' property
        
        const user = req.user; // get 'user' object from request object's 'user' property

        user.addresses.pull(addressId); // remove address object with given 'addressId' from 'addresses' array of 'user' object
        
        await user.save(); // save the updated user object to database

        res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses }); // send a 200 status code with a JSON object containing message that address was deleted sucessfully
        // and also send updated 'addresses' array after deleting object in this JSON
    } catch (error) { // if any error occurs while deleting a user's address
        console.error("Error in deleting user address: ", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}

export async function addToWishlist(req, res) { // create a function to add a product to user's wishlist in database, it takes user request and function response objects as parameters
    try {
        const { productId } = req.body; // get product's ID from request object's 'body' property
        
        const user = req.user; // get 'user' object from request object's 'user' property

        if (user.wishlist.includes(productId)) return res.status(400).json({ error: "Product already in wishlist" });
        // if product with extracted product ID already exists in 'wishlist' array of 'user' object, return 400 status code with a JSON object containing error message that product already exists in wishlist

        user.wishlist.push(productId); // otherwise add extracted product ID to 'wishlist' array of 'user' object

        await user.save(); // save the updated user object to database

        res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist }); // send a 200 status code with a JSON object containing message that product was added to wishlist sucessfully
        // and also send updated 'wishlist' array after adding product ID in this JSON
    } catch (error) { // if any error occurs while adding a product to user's wishlist
        console.error("Error in addToWishlist controller:", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}

export async function removeFromWishlist(req, res) { // create a function to remove a product from user's wishlist in database, it takes user request and function response objects as parameters
    try {
        const { productId } = req.params; // get product's ID from request object's 'params' property
        
        const user = req.user; // get 'user' object from request object's 'user' property

        if (!user.wishlist.includes(productId)) return res.status(400).json({ error: "Product not found in wishlist" });
        // if 'user' object's 'wishlist' array does not include extracted product ID, return 400 status code with a JSON object containing error message that product does not exist in wishlist

        user.wishlist.pull(productId); // otherwise remove extracted product ID from 'wishlist' array of 'user' object
        
        await user.save(); // save the updated user object to database

        res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist }); // send a 200 status code with a JSON object containing message that product was removed from wishlist sucessfully
    } catch (error) { // if any error occurs while removing a product from user's wishlist
        console.error("Error in removeFromWishlist controller:", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}

export async function getWishlist(req, res) { // create a function to get user's wishlist from database, it takes user request and function response objects as parameters
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        // find user by it's unique ID from 'user' array of request object and populate 'wishlist' array to return user data with wishlist items
        res.status(200).json({ wishlist: user.wishlist }); // send a 200 status code with a JSON object containing 'wishlist' array of 'user' object
    } catch (error) { // if any error occurs while getting user's wishlist
        console.error("Error in getWishlist controller:", error); // log it to the console to know what error occured
        res.status(500).json({ error: "Internal server error" }); // send a 500 status code with a JSON object containing error message that internal server error occured
    }
}