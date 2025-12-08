import { useState } from "react"; // import react hook to manage local component state for form fields and image selection

import {
    View, // import view component to structure layout for the create-book screen
    Text, // import text component to render labels, headers, and messages
    Platform, // import platform module to apply platform-specific keyboard handling logic
    KeyboardAvoidingView, // import wrapper to prevent keyboard from covering input fields
    ScrollView, // import scrollview to allow scrolling when content exceeds screen height
    TextInput, // import text input to capture title, caption, and rating values
    TouchableOpacity, // import touchable element to create interactive buttons
    Alert, // import alert utility to display error or validation messages
    Image, // import image component to preview selected book image
    ActivityIndicator, // import loading indicator to show progress during upload or submission
} from "react-native"; // import core react-native primitives for building the create-book interface

import { useRouter } from "expo-router"; // import router hook to navigate between screens after successful creation
import styles from "../../assets/styles/create.styles"; // import stylesheet for consistent visual styling of create screen elements
import { Ionicons } from "@expo/vector-icons"; // import icon set for using icons inside UI controls
import COLORS from "../../constants/colors"; // import predefined color constants to maintain branding consistency
import { useAuthStore } from "../../store/authStore"; // import auth store to access user session and token for authenticated requests
import * as ImagePicker from "expo-image-picker"; // import image picker module to allow user to select an image from device gallery
import * as FileSystem from "expo-file-system"; // import filesystem module to convert selected image into base64 for upload
import { API_URL } from "../../constants/api"; // import backend api base url for making create-book network requests

export default function Create() { // export create screen component to allow users to submit new book entries
    const [title, setTitle] = useState(""); // store book title input so the form remains controlled
    const [caption, setCaption] = useState(""); // store caption input to provide a description for the book
    const [rating, setRating] = useState(3); // maintain rating value to include user feedback for the book
    const [image, setImage] = useState(null); // store image URI for rendering a preview on the screen
    const [imageBase64, setImageBase64] = useState(null); // store base64 encoded image for uploading to backend
    const [loading, setLoading] = useState(false); // track submission status to show loader and disable UI actions

    const router = useRouter(); // create navigation handler to redirect user after successful creation

    const { token } = useAuthStore(); // access authentication token for authorized API requests

    console.log(token); // log token to debug authentication state during development

    const pickImage = async () => { // define function to allow user to select an image from the device gallery
        try { // start try block to safely handle permission and selection errors
            if (Platform.OS !== "web") { // ensure permission logic only runs on native platforms
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // request gallery permission to allow image picking

                if (status !== "granted") { // handle permission denial
                    Alert.alert("Permission Denied", "We need camera roll permissions to upload an image"); // notify user that permission is required
                    return; // stop execution because image selection is not possible without permission
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({ // open image picker to allow the user to select a photo
                mediaTypes: "images", // restrict selection to images only
                allowsEditing: true, // allow user to crop or edit selected image
                aspect: [4, 3], // enforce aspect ratio for consistent image dimensions
                quality: 0.5, // reduce image quality to optimize upload size
                base64: true, // request base64 data to support image upload
            });

            if (!result.canceled) { // execute logic only when user selects an image
                setImage(result.assets[0].uri); // store selected image uri to display preview

                if (result.assets[0].base64) { // check if base64 was returned directly by the picker
                    setImageBase64(result.assets[0].base64); // store base64 string for upload
                }

                else { // when base64 is not available directly from picker
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { // read file manually and convert to base64
                        encoding: FileSystem.EncodingType.Base64, // specify base64 encoding to match backend requirements
                    });

                    setImageBase64(base64); // store converted base64 string
                }
            }
        } catch (error) { // catch any unexpected runtime errors
            console.error("Error picking image:", error); // log error for debugging
            Alert.alert("Error", "There was a problem selecting your image"); // notify user that image selection failed
        }
    };

    const handleSubmit = async () => { // define handler to submit new book data to backend
        if (!title || !caption || !imageBase64 || !rating) { // validate required fields before sending request
            Alert.alert("Error", "Please fill in all fields"); // notify user of missing information
            return; // stop execution because submission is invalid
        }

        try { // begin try block to handle submission logic safely
            setLoading(true); // enable loading state to indicate active request

            const uriParts = image.split("."); // split file uri to extract file extension for MIME type detection

            const fileType = uriParts[uriParts.length - 1]; // obtain file extension from last segment

            const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg"; // determine correct MIME type fallback to jpeg

            const imageDataUrl = `data:${imageType};base64,${imageBase64}`; // construct data url for backend upload

            const response = await fetch(`${API_URL}/books`, { // send post request to backend to create a new book
                method: "POST", // specify POST because a new book entry is being created
                headers: {
                    Authorization: `Bearer ${token}`, // include auth token to authorize content creation
                    "Content-Type": "application/json", // indicate json payload format
                },
                body: JSON.stringify({ // serialize book data into json for server processing
                    title, // pass user-entered book title
                    caption, // pass caption describing the book
                    rating: rating.toString(), // convert rating to string to match backend requirements
                    image: imageDataUrl, // send base64 encoded image wrapped in data url
                }),
            });

            const data = await response.json(); // parse response body so error or success message can be accessed

            if (!response.ok) throw new Error(data.message || "Something went wrong"); // raise error when backend returns failure

            Alert.alert("Success", "Your book recommendation has been posted!"); // show success message after successful creation

            setTitle(""); // reset title so form clears after submission
            setCaption(""); // reset caption input for new entry
            setRating(3); // reset rating to default value for next use
            setImage(null); // clear selected image preview
            setImageBase64(null); // clear stored base64 to avoid sending old data

            router.push("/"); // navigate back to home screen after successful creation
        } catch (error) { // handle errors during submission
            console.error("Error creating post:", error); // log error details for debugging
            Alert.alert("Error", error.message || "Something went wrong"); // notify user of failure
        } finally { // always execute cleanup regardless of success or failure
            setLoading(false); // disable loading state once request is complete
        }
    };

    const renderRatingPicker = () => { // define function to render interactive rating component
        const stars = []; // initialize array to store star elements

        for (let i = 1; i <= 5; i++) { // loop through possible rating values 1 to 5
            stars.push( // push star icon button for each rating value
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"} // show filled or outline star depending on current rating selection
                        size={32}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary} // apply active or inactive star color
                    />
                </TouchableOpacity>
            );
        }

        return <View style={styles.ratingContainer}>{stars}</View>; // wrap all stars inside a container for layout control
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Book Recommendation</Text>
                        <Text style={styles.subtitle}>Share your favorite reads with others</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Title</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter book title"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title} // bind current title state so the input reflects stored value
                                    onChangeText={setTitle} // update title state on each keystroke to keep form controlled
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Your Rating</Text>
                            {renderRatingPicker() /* render interactive star-based rating selector */}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Image</Text>

                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}> {/* open image picker when pressed */}
                                {image ? ( // check whether an image has been selected
                                    <Image source={{ uri: image }} style={styles.previewImage} /> // display selected image preview
                                ) : (
                                    <View style={styles.placeholderContainer}> {/* show placeholder UI when no image is chosen */}
                                        <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                                        <Text style={styles.placeholderText}>Tap to select image</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Caption</Text>

                            <TextInput
                                style={styles.textArea}
                                placeholder="Write your review or thoughts about this book..."
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption} // bind current caption state so input always reflects stored value
                                onChangeText={setCaption} // update caption state with each keystroke to maintain controlled form behavior
                                multiline
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit} // execute submission logic when user taps the share button
                            disabled={loading} // disable button while upload is in progress to prevent duplicate posts
                        >
                            {loading ? ( // show loader when submission is active
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={20}
                                        color={COLORS.white}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Share</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}