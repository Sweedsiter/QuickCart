'use client'
import Sidebar from '@/components/seller/Sidebar'
import React, { useEffect } from "react";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const Layout = ({ children }) => {
  
    const { setIsLoading, isLoading } = useAppContext();

    useEffect(() => {   
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false); 
      }, 1000);  
      return () => clearTimeout(timer); 
    }, [setIsLoading]);
  
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>;
    }

 
  return (
    <div>

      <div className='flex w-full'>
        <Sidebar />       
        {children}
      </div>
    </div>
  )
}

export default Layout