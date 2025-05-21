import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const NavSearch = ({ product }) => {
    const { router } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

   

    return (
        <div className="flex flex-col flex-wrap items-center justify-center ">

            {!isModalOpen && <div
                className="flex flex-row justify-between w-full md:w-2/3 cursor-pointer m-1 p-2 bg-white  rounded-lg shadow-md z-10 "
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