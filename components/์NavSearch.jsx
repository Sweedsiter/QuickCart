import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const NavSearch = ({ product }) => {
    const { router } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

   

    return (
        <div>

            {!isModalOpen && <div
                className="flex flex-row cursor-pointer m-6 p-2 bg-white  rounded-lg shadow-md z-10 transition-all duration-300 ease-in-out transform hover:scale-105"
                onMouseEnter={(e) => e.currentTarget.classList.add("shadow-lg")}
                onClick={() => {
                    router.push(`/product/${product._id}`);
                    setIsModalOpen(true);                 
                }}
            >
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover "
                    width={80}
                    height={80}
                
                />

                <div className="flex flex-col justify-center items-start pl-18">
                    <p className="font-medium text-gray-800 p-8">{product.name}</p>
                </div>
            </div>}
        </div>

    );
};

export default NavSearch;