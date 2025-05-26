'use client'
import React, { useEffect } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";



const Home = () => {
  const {isLoading,setIsLoading} = useAppContext()

  useEffect(() => {
    // Simulate a loading process
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false); // Stop loading after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [setIsLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <Loading /> 
      </div>;
  }

  return (
    <>
        <div className="px-6 md:px-16 lg:px-32">
          <HeaderSlider />
          <HomeProducts />
          <FeaturedProduct />
          <Banner />
          <NewsLetter />
        </div>
    </>
  );
};

export default Home;
