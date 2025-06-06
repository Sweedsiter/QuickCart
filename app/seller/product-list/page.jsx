'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, getToken, user, isSeller, setIsLoading, isLoading } = useAppContext()

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <Loading />
    </div>;
  }

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Delete product function
  const oneDelete = (id) => async () => {
    setIsLoading(true);
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return; // Exit if the user cancels the confirmation dialog
    }

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Product deleted successfully");
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id)); // Update the product list
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  // Update product function
  const handleUpdate = (id) => () => {
    router.push(`/seller/update-product/${id}`)
  }

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get('/api/product/seller-list', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        const sortedOrders = data.products.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProducts(sortedOrders)
        setLoading(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (!isSeller) {
      router.push('/')
    }
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || product.category === selectedCategory)
  );

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <div className="flex items-center justify-center h-screen">
        <Loading />
      </div> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
          className="border border-gray-300 rounded-md p-2 my-2"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ค้นหาตามชื่อ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="border border-gray-300 rounded px-4 py-2 w-fit mb-4 md:ml-4"
        />
        <span className="md:ml-4 block w-full my-2">ทั้งหมด : {filteredProducts.length} ลาย</span>
        <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className=" table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">Price</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Delete</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Update</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">

              {filteredProducts.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <img
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                  <td className="px-4 py-3">${product.offerPrice}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md">
                      <span className="hidden md:block">Visit</span>
                      <Image
                        className="h-3.5"
                        src={assets.redirect_icon}
                        alt="redirect_icon"
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3" >
                    <button onClick={oneDelete(product._id)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md">
                      <span className="hidden md:block">Delete</span>
                    </button></td>
                  <td className="px-4 py-3" >
                    <button onClick={handleUpdate(product._id)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-green-600 text-white rounded-md">
                      <span className="hidden md:block">Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
};

export default ProductList;