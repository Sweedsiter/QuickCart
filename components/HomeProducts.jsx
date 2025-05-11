import React,{useState} from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const HomeProducts = () => {

  const { products, router } = useAppContext()
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push('/all-products');
  };


  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col w-full mb-8 text-3xl ">
        <p className="text-2xl font-medium text-left w-full">Popular products</p>
    
        <div className="w-24 h-0.5 bg-orange-600 rounded-full"></div>
      </div>
      {/* <p onClick={() => { router.push('/all-products') }} className="underline text-blue-600 hover:text-lg cursor-pointer">กดดูทั้งหมด....</p> */}
      {
        products.length === 0 ? <div className="md:h-[400px] h-[300px]"><Loading /></div> :
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 flex-col items-center gap-6 mt-6 pb-14 w-full h-[340px]  md:h-[500px] overflow-x-hidden overflow-y-auto">
            {products.map((product, index) => <ProductCard key={index} product={product} />)}
          </div>
      }      
          <button
        onClick={handleClick}
        disabled={isLoading}
        className={`px-12 py-2.5 border rounded transition mt-6
          ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-500/70 hover:bg-slate-50/90 hover:text-black'}
        `}
      >
        {isLoading ? 'กำลังโหลด...' : 'กดดูทั้งหมด....'}
      </button>
    </div>
  );
};

export default HomeProducts;
