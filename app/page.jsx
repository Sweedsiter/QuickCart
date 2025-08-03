'use client'
import React from "react";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import { Category } from "@/components/Category";

const AllProducts = () => {
  const { products,selectedCategoryNav, searchQuery} = useAppContext();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategoryNav === "เลือกกลุ่ม" || product.category === selectedCategoryNav;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const shuffleArray = (array) => {
    return array.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  const shuffledProducts = shuffleArray(filteredProducts);

  return (
    <>   
      <div className=" flex flex-col items-start px-6 md:px-16 lg:px-32 "> 
        <div className="md:hidden flex items-center justify-between  w-full  flex-wrap">
            <Category/>      
        </div>

        {/* Product Grid */}
        {
          products.length === 0 ? <div className="w-full h-[400px]"><Loading /></div> :
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 pt-6  pb-14 w-full h-[700px] overflow-auto">
              {!shuffledProducts ? <Loading /> : shuffledProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
        }
      </div> 
    </>
  );
};
export default AllProducts;
