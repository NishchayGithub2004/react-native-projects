import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

function ProductsPage() {
    const [showModal, setShowModal] = useState(false); // create a variable named 'showModal' with initial value of false and a function 'setShowModal' to update it's value
    
    const [editingProduct, setEditingProduct] = useState(null); // create an object named 'editingProduct' with initial value of null and a function 'setEditingProduct' to update it's value
    
    // create an object named 'formData' with initial values of all it's properties as empty strings and a function 'setFormData' to update the values of it's properties
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
    });
    
    const [images, setImages] = useState([]); // create an array named 'images' with initial value of an empty array and a function 'setImages' to update it's value
    
    const [imagePreviews, setImagePreviews] = useState([]); // create an array named 'imagePreviews' with initial value of an empty array and a function 'setImagePreviews' to update it's value

    const queryClient = useQueryClient(); // create an instance of 'useQueryClient' hook

    const { data: products = [] } = useQuery({ // create an instance of 'useQuery' hook that takes 'data' which is 'products' array which is empty initially
        queryKey: ["products"], // 'products' is the unique name for this instance
        queryFn: productApi.getAll, // 'queryFn' is a function that uses 'getAll' function from 'productApi' object to fetch data
    });

    const createProductMutation = useMutation({ // create an instance of 'useMutation' hook to create/update data
        mutationFn: productApi.create, // 'mutationFn' is a function that uses 'create' function from 'productApi' object to create/update data
        onSuccess: () => { // once the mutation is successful
            closeModal(); // call 'closeModal' function
            queryClient.invalidateQueries({ queryKey: ["products"] }); // invalidate the query of 'products' instance to reuse it later from scratch
        },
    });

    const updateProductMutation = useMutation({ // create an instance of 'useMutation' hook to update data
        mutationFn: productApi.update, //'mutationFn' is a function that uses 'update' function from 'productApi' object to update data
        onSuccess: () => { // once the mutation is successful
            closeModal(); // call 'closeModal' function
            queryClient.invalidateQueries({ queryKey: ["products"] }); // invalidate the query of 'products' instance to reuse it later from scratch
        },
    });

    const deleteProductMutation = useMutation({ // create an instance of 'useMutation' hook to delete data
        mutationFn: productApi.delete, //'mutationFn' is a function that uses 'delete' function from 'productApi' object to delete data
        onSuccess: () => { // once the mutation is successful
            closeModal(); // call 'closeModal' function
            queryClient.invalidateQueries({ queryKey: ["products"] }); // invalidate the query of 'products' instance to reuse it later from scratch
        },
    });

    const closeModal = () => { // create a function named 'closeModal'
        setShowModal(false); // set 'showModal' to false
        
        setEditingProduct(null); // set 'editingProduct' to null

        setFormData({ // set properties of 'formData' object to initial values (empty strings)
            name: "",
            category: "",
            price: "",
            stock: "",
            description: "",
        });
        
        setImages([]); // set 'images' array to empty array
        
        setImagePreviews([]); // set 'imagePreviews' array to empty array
    };

    const handleEdit = (product) => { // create a function named 'handleEdit' that takes 'product' object as a parameter
        setEditingProduct(product); // set 'editingProduct' to 'product' object
        
        // set properties of 'formData' object to values of 'product' object
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description,
        });
        
        setImagePreviews(product.images); // set 'imagePreviews' array to 'images' array of 'product' object
        
        setShowModal(true); // set 'showModal' to true
    };

    const handleImageChange = (e) => { // create a function named 'handleImageChange' that takes event object 'e' object as a parameter
        const files = Array.from(e.target.files); // create an array named 'files' from event object 'e'
        
        if (files.length > 3) return alert("Maximum 3 images allowed"); // if 'files' array has more than 3 elements, return an alert message that maximum 3 images are allowed

        imagePreviews.forEach((url) => { // iterate over each element of 'imagePreviews' array
            if (url.startsWith("blob:")) URL.revokeObjectURL(url); // if the url starts with "blob:", revoke the object URL ie remove it
        });

        setImages(files); // set 'images' array to 'files' array
        
        setImagePreviews(files.map((file) => URL.createObjectURL(file))); // set 'imagePreviews' array to a new array that contains the object URLs of each file in 'files' array
    };

    const handleSubmit = (e) => { // create a function named 'handleSubmit' that takes event object 'e' object as a parameter
        e.preventDefault(); // prevent the default behavior of the event object 'e' so that we can do some things before submitting the form

        if (!editingProduct && imagePreviews.length === 0) return alert("Please upload at least one image");
        // if 'editingProduct' is null and 'imagePreviews' array has no elements, return an alert message that at least one image is required

        // create an instance of 'FormData' class and append the values of 'formData' object to it
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("stock", formData.stock);
        formDataToSend.append("category", formData.category);

        if (images.length > 0) images.forEach((image) => formDataToSend.append("images", image));
        // if 'images' array has elements, iterate over each element and append it to 'formDataToSend' object

        if (editingProduct) { // if 'editingProduct' is not null
            updateProductMutation.mutate({ id: editingProduct._id, formData: formDataToSend });
            // call 'updateProductMutation' object's 'mutate' method and pass an object with 'id' and 'formData' properties
        } else {
            createProductMutation.mutate(formDataToSend); // otherwise, call 'createProductMutation' object's 'mutate' method and pass 'formDataToSend' object as argument
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-base-content/70 mt-1">Manage your product inventory</p>
                </div>

                <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2"> {/* clicking this button sets 'showModal' to true */}
                    <PlusIcon className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {products?.map((product) => { // iterate over each element of 'products' array as 'product' (optional chaining so that if 'products' does not exist, not error occurs)
                    const status = getStockStatusBadge(product.stock); // get the stock status badge for 'product' object based on it' quantity available in stock

                    return (
                        <div key={product._id} className="card bg-base-100 shadow-xl"> {/* product's unique ID is the unique identifier of this product */}
                            <div className="card-body">
                                <div className="flex items-center gap-6">
                                    <div className="avatar">
                                        <div className="w-20 rounded-xl">
                                            <img src={product.images[0]} alt={product.name} /> {/* render first image of the product or product's name if image doesn't exist */}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                {/* render product's name and category */}
                                                <h3 className="card-title">{product.name}</h3>
                                                <p className="text-base-content/70 text-sm">{product.category}</p>
                                            </div>
                                            <div className={`badge ${status.class}`}>{status.text}</div> {/* render stock status badge with styles applied based on status */}
                                        </div>
                                        
                                        <div className="flex items-center gap-6 mt-4"> {/* render product's price and quantity in stock */}
                                            <div>
                                                <p className="text-xs text-base-content/70">Price</p>
                                                <p className="font-bold text-lg">${product.price}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs text-base-content/70">Stock</p>
                                                <p className="font-bold text-lg">{product.stock} units</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            className="btn btn-square btn-ghost"
                                            onClick={() => handleEdit(product)} // clicking this button calls 'handleEdit' function and passes 'product' object as argument
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        
                                        <button
                                            className="btn btn-square btn-ghost text-error"
                                            onClick={() => deleteProductMutation.mutate(product._id)} // clicking this button calls 'deleteProductMutation' object's 'mutate' method and passes product's ID as argument
                                        >
                                            {deleteProductMutation.isPending ? ( // if 'isPending' state of 'deleteProductMutation' object is true ie product is being deleted, render loading spinner, otherwise, render trash icon */}
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                <Trash2Icon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <input type="checkbox" className="modal-toggle" checked={showModal} /> {/* whether this checkbox is checked or not depends on value of 'showModal' */}

            <div className="modal">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-2xl">
                            {editingProduct ? "Edit Product" : "Add New Product"} {/* render message based on whether value of 'editingProduct' is true or false */}
                        </h3>

                        <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost"> {/* clicking this button calls 'closeModal' function */}
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4"> {/* submitting this form calls 'handleSubmit' function */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span>Product Name</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    className="input input-bordered"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span>Category</span>
                                </label>
                                
                                <select
                                    className="select select-bordered"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span>Price ($)</span>
                                </label>
                                
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input input-bordered"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span>Stock</span>
                                </label>
                                
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="input input-bordered"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control flex flex-col gap-2">
                            <label className="label">
                                <span>Description</span>
                            </label>
                            
                            <textarea
                                className="textarea textarea-bordered h-24 w-full"
                                placeholder="Enter product description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Product Images
                                </span>
                                <span className="label-text-alt text-xs opacity-60">Max 3 images</span>
                            </label>

                            <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange} // changing this input calls 'handleImageChange' function
                                    className="file-input file-input-bordered file-input-primary w-full"
                                    required={!editingProduct} // if 'editingProduct' is null, this input is required to be given a value
                                />

                                {editingProduct && ( // if 'editingProduct' is not null, render this text
                                    <p className="text-xs text-base-content/60 mt-2 text-center">
                                        Leave empty to keep current images
                                    </p>
                                )}
                            </div>

                            {imagePreviews.length > 0 && ( // if 'imagePreviews' array has elements, render the following content
                                <div className="flex gap-2 mt-2">
                                    {imagePreviews.map((preview, index) => ( // iterate over 'imagePreview' array as 'preview' and 'index'
                                        <div key={index} className="avatar"> {/* render 'preview' as an image with it's 'index' as unique identifier and (index + 1) as text to appear if image could not be rendered */}
                                            <div className="w-20 rounded-lg">
                                                <img src={preview} alt={`Preview ${index + 1}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={closeModal} // clicking this button calls 'closeModal' function
                                className="btn"
                                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                                // this button is disabled if either 'createProductMutation' or 'updateProductMutation' object's 'isPending' state is true ie clicking it does nothing
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                                // this button is disabled if either 'createProductMutation' or 'updateProductMutation' object's 'isPending' state is true ie clicking it does nothing
                            >
                                {createProductMutation.isPending || updateProductMutation.isPending ? ( // if either 'createProductMutation' or 'updateProductMutation' object's 'isPending' state is true 
                                    <span className="loading loading-spinner"></span> // render loading spinner
                                ) : editingProduct ? ( // otherwise, if 'editingProduct' is not null, render "Update Product", otherwise, render "Add Product"
                                    "Update Product"
                                ) : (
                                    "Add Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;