import { collection, doc, setDoc } from "firebase/firestore"; // import 'collection' function to get a collection/table, 'doc' function to get a document/row, and 'setDoc' to create a document/row in the collection/table
import { slots } from "../store/restaurants"; // import 'slots' array of objects to upload data to the database
import { db } from "./firebaseConfig"; // import 'db' object to connect to the database to add data to

const restaurantData = slots; // assign 'slots' array of objects to 'restaurantData' variable

const uploadData = async () => { // create a function named 'uploadData' to upload data to the database
    try {
        for (let i = 0; i < restaurantData.length; i++) { // iterate over each object in 'restaurantData' array
            const restaurant = restaurantData[i]; // assign current object to 'restaurant' variable
            
            const docRef = doc(collection(db, "slots"), `slot_${i + 1}`); // create a document with a unique ID 'slot_[document_number] in the 'slots' collection
            
            await setDoc(docRef, restaurant); // upload the 'restaurant' object to the document created
        }
        
        console.log("Data uploaded"); // log a message to the console to indicate that the data has been uploaded
    } catch (e) { // if any error occurs while adding data to the database
        console.log("Error uploading data", e); // log the error that occured to the console
    }
};

export default uploadData; // export the function to be used in other parts of the application