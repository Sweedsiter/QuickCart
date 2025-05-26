import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const products = [
  {
    id: 1,
    image: assets.พระครูปคุณสิริธรรม,
    title: "ลายปัก ตาลปัต ขนาดใหญ่",
    description: "ลายขนาดใหญ่ เหมาะกับการปักผ้าที่ลองรับผีเข็มได้",
  },
  {
    id: 2,
    image: assets.ร้านนานาภัณฑ์02,
    title: "ลายปัก ขนาดกลาง",
    description: "ปักหลังเสื้อ ถุงผ้า ย่าม หรือกระเป๋า เหมาะกับผ้าที่ลองรับได้",
  },
  {
    id: 3,
    image: assets.กรณ์อาฌาณ,
    title: "ลายปัก ขนาดกลาง",
    description: "ปักหลังเสื้อ ถุงผ้า ย่าม วอเบเบอร์ หรือกระเป๋า เหมาะกับผ้าที่ลองรับได้",
  },
];

const FeaturedProduct = () => {

  const { router,setIsLoading, isLoading} = useAppContext()

  const handleClick = () => {
    setIsLoading(true);
    router.push('/all-products');
  };

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Embroidery</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative p-8 group bg-gray-100 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-black space-y-2 bg-white p-4 rounded-lg shadow-lg">
              <p className="font-medium text-xl  lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <button onClick={handleClick} disabled={isLoading} className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded text-white">               
                ลายทั้งหมด <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
