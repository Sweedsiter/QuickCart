'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateProductPage() {
    const router = useRouter();
    const { id } = router.query; // Get the product ID from the URL
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch product data by ID
    useEffect(() => {
        if (id) {
            axios
                .get(`/api/product/updateID?id=${id}`)
                .then((response) => {
                    const { data } = response;
                    if (data.success) {
                        setProductData(data.product);
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch((error) => toast.error(error.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.put(`/api/product/update`, {
                id,
                updates: productData,
            });

            if (data.success) {
                toast.success("Product updated successfully!");
                router.push("/seller"); // Redirect to the seller dashboard
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!productData) {
        return <div>Product not found</div>;
    }

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between">
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <h1 className="text-2xl font-bold">Update Product</h1>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="product-name" className="text-base font-medium">
                            Product Name
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            value={productData.name}
                            onChange={(e) =>
                                setProductData({ ...productData, name: e.target.value })
                            }
                            placeholder="Product Name"
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="product-description" className="text-base font-medium">
                            Product Description
                        </label>
                        <textarea
                            id="product-description"
                            rows={4}
                            value={productData.description}
                            onChange={(e) =>
                                setProductData({ ...productData, description: e.target.value })
                            }
                            placeholder="Product Description"
                            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
                            required
                        ></textarea>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="product-category" className="text-base font-medium">
                            Category
                        </label>
                        <select
                            id="product-category"
                            value={productData.category}
                            onChange={(e) =>
                                setProductData({ ...productData, category: e.target.value })
                            }
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                        >
                            <option value="Earphone">Earphone</option>
                            <option value="Headphone">Headphone</option>
                            <option value="Watch">Watch</option>
                            <option value="Smartphone">Smartphone</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Camera">Camera</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="product-price" className="text-base font-medium">
                            Product Price
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            value={productData.price}
                            onChange={(e) =>
                                setProductData({ ...productData, price: e.target.value })
                            }
                            placeholder="Product Price"
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="offer-price" className="text-base font-medium">
                            Offer Price
                        </label>
                        <input
                            id="offer-price"
                            type="number"
                            value={productData.offerPrice}
                            onChange={(e) =>
                                setProductData({ ...productData, offerPrice: e.target.value })
                            }
                            placeholder="Offer Price"
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
                    >
                        Update Product
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}