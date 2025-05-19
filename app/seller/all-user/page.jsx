'use client';
import React, { useEffect, useState } from "react";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";

const All_user = () => {
    const {  router,isSeller } = useAppContext()

      useEffect(() => {
        if(!isSeller){
          router.push('/')
        }
     
      })
    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">       
            

            <Footer />
        </div>
    );
}
export default All_user 