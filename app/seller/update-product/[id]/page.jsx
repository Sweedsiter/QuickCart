"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/Loading";
import Image from "next/image";




export default function UpdateProduct() {
 
    const { id } = useParams(); // Get the product ID from the URL parameters
    const [product, setProduct] = useState(null); // State to hold the product data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const { getToken ,products  } = useAppContext(); // Get the token from context
    const router = useRouter(); // Initialize the router
    

    const categories = ["All", ...new Set(products.map((product) => product.category))];
    // Fetch product data by ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get(`/api/product/updateId?id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data.success) {
                    setProduct(data.product);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch product data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, getToken]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const { data } = await axios.put(
                `/api/product/update`,
                { id, updates: product },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                toast.success("Product updated successfully!");               
                router.push(`/seller/product-file/${data.product._id}`)   
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product");
        }
        //  router.push("/seller/product-list"); // Redirect to the seller dashboard
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
        <Loading /> 
        </div>;
    }   

    if (!product) {
        return <div className="text-center mt-10">Product not found</div>;
    }

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between w-full">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {product.image && product.image.length > 0 ? (
                            <Image
                                src={product.image[0]} // Ensure this is a valid image URL
                                alt="Product Image"
                                className="w-32 h-32 object-cover rounded-md"
                                width={128} // Optional: Specify width
                                height={128} // Optional: Specify height
                            />
                        ) : (
                            <p className="text-gray-500">No image available</p>
                        )}
                       
                    </div>
                </div>
                
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    />
                </div>

                <div className="flex flex-col gap-1 w-32">
                    <label className="text-base font-medium" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        value={product.category}
                        required
                    >
                        {/* <option value="Earphone">Earphone</option> */}
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}

                    </select>
                </div>


                <div className="flex flex-col gap-1 max-w-md">
                    <label
                        className="text-base font-medium"
                        htmlFor="product-description"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        required
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                    ></textarea>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">
                        Price
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        required
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">
                        offerPrice
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.offerPrice}
                        onChange={(e) => setProduct({ ...product, offerPrice: e.target.value })}
                        required
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    />
                </div>

                <button type="submit" className="px-8 py-2.5 bg-orange-500 text-white font-medium rounded">
                    Update
                </button>
            </form>
        </div>
    );
}