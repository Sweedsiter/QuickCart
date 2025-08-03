"use client"
import React, { useState } from "react";
import { assets, BagIcon, CartIcon, HomeIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import NavSearch from '@/components/์NavSearch'
import { RiShoppingBagFill } from "react-icons/ri";
import { LuShoppingBag } from "react-icons/lu";
import Link from "next/link";
import { ListOrdered } from "lucide-react";
import { Category } from "./Category";


const Navbar = () => {
  const { isSeller, user, setIsLoading ,getCartCount,router} = useAppContext();
  const clerk = useClerk()
  const pathname = usePathname();
  const handleClickHome = () => {
    setIsLoading(true);
    router.push('/');
  };
  const handleClickCart= () => {  
     setIsLoading(true);
    if(user){
      setIsLoading(false);
      router.push('/cart');
    }
  };
  const handleClickMy_order = () => {
    setIsLoading(true);
    router.push('/my-orders');
  };

  const handleClickSeller = () => { 
    setIsLoading(true);
    router.push('/seller');
  };
  return (
    <nav className="flex items-center sticky top-0 z-50 bg-white justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700" >
      <Image
        className="cursor-pointer w-28 md:w-32  hover:scale-105 transition duration-200"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="items-center gap-4 relative hidden md:flex">   
           <Category/> 
      </div>  

      <ul className="hidden md:flex items-center gap-4 ">
   
       {isSeller && <button onClick={handleClickSeller} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        <RiShoppingBagFill onClick={handleClickHome} className={`text-2xl ${pathname === "/" ? "text-orange-600 " : "" }`}/>   
       {user ? <>  
        <Link href={'/cart'}  className={`group relative ${pathname === "/cart" ? "text-orange-600 " : "" }`}>
              <LuShoppingBag className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
              {getCartCount() > 0 &&
              <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
               {getCartCount()}
              </span>
               }
          </Link> 
          <Link href={'/my-orders'}  className={`group relative ${pathname === "/my-orders" ? "text-orange-600 " : "" }`}>
             <ListOrdered  />
          </Link>
        <UserButton/> 
         </>
            : <button onClick={() => clerk.openSignIn({})} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="flex justify-between items-center w-full text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        {
          user
            ? <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="หน้าแรก" labelIcon={<HomeIcon />} onClick={handleClickHome} />
                </UserButton.MenuItems>      
                <UserButton.MenuItems>
                  <UserButton.Action label={`ตะกร้า ${getCartCount()}`} labelIcon={<CartIcon />} onClick={handleClickCart} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="รายการสั่งซื้อ" labelIcon={<BagIcon />} onClick={handleClickMy_order} />
                </UserButton.MenuItems>
              </UserButton>
            </>
            : <button onClick={() => clerk.openSignIn({})} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>}
      </div>
    </nav>
  );
};

export default Navbar;