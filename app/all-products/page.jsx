'use client'
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  

    // Extract unique categories from products
    const categories = ["All", ...new Set(products.map((product) => product.category))];

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

    // Shuffle products
    const shuffleArray = (array) => {
      return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    };  
    const shuffledProducts = shuffleArray(filteredProducts);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 ">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All Embroidery</p>
          <div className="w-24 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {/* Category Filter */}
   
        <div className="flex items-center justify-between mt-6 w-full max-w-md flex-wrap md:flex-nowrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2 my-2 "
          >
            {categories.map((category, index) => (
              <option  key={index} value={category}>
                {category}
              </option>
            ))}
          </select>          
          <input
            type="text"
            placeholder="ค้นหาชื่อโลโก้..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-2 md:ml-4 w-full"
          />
          <span className="md:ml-4 block w-full my-2">ทั้งหมด : {filteredProducts.length} ลาย</span>
        </div>

         {/* Product Grid */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full h-[700px] overflow-auto">
          {shuffledProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;