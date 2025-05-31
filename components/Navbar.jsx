"use client"
import React, { useState, useEffect } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import NavSearch from '@/components/์NavSearch'

const Navbar = () => {

  const { isSeller, user, products, setIsLoading } = useAppContext();
  const clerk = useClerk()
  const pathname = usePathname();
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false); // State to toggle search input
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products

  const handleClickAll_products = () => {
    setIsLoading(true);
    router.push('/all-products');
  };

  const handleClickHome = () => {
    setIsLoading(true);
    router.push('/');
  };
  const handleClickCart= () => {
    setIsLoading(true);
    router.push('/cart');
  };
  const handleClickMy_order = () => {
    setIsLoading(true);
    router.push('/my-orders');
  };

  const handleClickSeller = () => {
    setIsLoading(true);
    router.push('/seller');
  };

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  // Clear filteredProducts when clicking outside
  useEffect(() => {
    const handleBodyClick = (event) => {
      const searchContainer = document.querySelector(".search-container");
      if (searchContainer && !searchContainer.contains(event.target)) {
        setFilteredProducts([]);
      }
    };

    document.addEventListener("click", handleBodyClick);

    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700" onClick={() => { setFilteredProducts([]), setSearchQuery("") }}>
      <Image
        className="cursor-pointer w-28 md:w-32  hover:scale-105 transition duration-200"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <button onClick={handleClickHome} className={`hover:font-bold transition ${pathname === "/" ? "text-orange-600  font-bold" : ""
          }`}>
         หน้าแรก
        </button>
        <button  onClick={handleClickAll_products} className={`hover:font-bold transition ${pathname === "/all-products" ? "text-orange-600 font-bold" : ""
          }`}>
        รวมลายปัก        
        </button>
        {isSeller && <button onClick={handleClickSeller} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
      </div>
      <ul className="hidden md:flex items-center gap-4 ">
        <div className="flex items-center gap-4 relative">
          {showSearch && (
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w- pl-2"
            />
          )}
          {filteredProducts.length > 0 && (
            <div className=" fixed inset-0 bg-orange-200 bg-opacity-75   z-20 mt-20  h-full overflow-y-auto" onClick={() => { setFilteredProducts([]), setSearchQuery("") }}>
              {filteredProducts.map((product) => (
                <NavSearch product={product} />
              ))}
            </div>
          )}



          {
            showSearch ? (
              <button onClick={() => { setShowSearch(false), setFilteredProducts([]), setSearchQuery() }} className="text-red-500  hover:font-bold transition">
                X
              </button>
            ) : (
              <button onClick={() => setShowSearch(true)} className="text-gray-500 hover:text-gray-900 transition">
                <Image src={assets.search_icon} alt="search icon" />
              </button>
            )}

        </div>

        {
          user
            ? <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="ตะกร้า" labelIcon={<CartIcon />} onClick={handleClickCart} />
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
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        {
          user
            ? <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="หน้าแรก" labelIcon={<HomeIcon />} onClick={handleClickHome} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="รวมลายปัก" labelIcon={<BoxIcon />} onClick={handleClickAll_products} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="ตะกร้า" labelIcon={<CartIcon />} onClick={handleClickCart} />
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