import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, router } = useAppContext()

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col w-full mb-8 text-3xl ">
        <p className="text-2xl font-medium text-left w-full">Popular products</p>
        <div className="w-24 h-0.5 bg-orange-600 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full h-[400px] overflow-x-hidden overflow-y-auto">
        {products.map((product, index) => <ProductCard key={index} product={product} />)}
      </div>
      <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition mt-16">
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
