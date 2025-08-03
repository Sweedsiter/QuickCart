"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

const Product = () => {
    const clerk = useClerk()
    const { id } = useParams();
    const { products, router, addToCart, isLoading, setIsLoading, user } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [id, products.length])

    const handleAddToCart = (productId) => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า");
            clerk.openSignIn(); // Open the Clerk sign-in modal   
            return;
        }
        addToCart(productId);
    };

    const handleAddToCartAndGoToCart = (productId) => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า");
            clerk.openSignIn(); // Open the Clerk sign-in modal   
            return;
        }
        addToCart(productId);
        router.push("/cart");
    };

    const handleNextProduct = () => {
        const currentIndex = products.findIndex((product) => product._id === id);
        const nextIndex = (currentIndex + 1) % products.length; // Loop back to the first product
        const nextProduct = products[nextIndex];
        router.push(`/product/${nextProduct._id}`);
    };
    const handlePreviousProduct = () => {
        const currentIndex = products.findIndex((product) => product._id === id);
        const previousIndex = (currentIndex - 1 + products.length) % products.length; // Loop back to the last product
        const previousProduct = products[previousIndex];
        router.push(`/product/${previousProduct._id}`);
    };
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <Loading />
        </div>;
    }
    return productData ? (<>
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Cart */}
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-400/10 mb-4" >
                        {/* <Image
                            onClick={() => setIsModalOpen(true)}
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        /> */}

                        <img
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            onClick={() => setIsModalOpen(true)}
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                {/* <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                /> */}
                                <img
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                {/* addtoCart productData._id */}

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        ฿{productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            ฿{productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full ">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Dx-emb</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Embroidery</td>
                                    <td className="text-gray-800/50 ">By Wilcom</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Emb file</td>
                                    <td className="text-gray-800/50 ">ไฟล์ .emb เป็นไฟล์ wilcom เปิดได้ตั้งแต่เวอร์ชั่น ES2006/E.1/E1.5/E1.8/E2/E3/E3.5/E3.6/E4/E4.5/E5, </td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">PES file</td>
                                    <td className="text-gray-800/50 ">ไฟล์ .PES เปิดได้ตั้งแต่เวอร์ชั่น PES 5/PES 6/PES 7/PES 8/PES 9/PES 10 และเวอร์ชั่นที่สูงกว่า,</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">DST file</td>
                                    <td className="text-gray-800/50 ">ไฟล์ .DST เป็นไฟล์ที่ใช้สำหรับเครืองอุตสาหกรรมใช้ได้กับทุกรุ่นที่เป็นเครื่องปักจักรคอม</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={() => handleAddToCart(productData._id)} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                            เพิ่มใส่ตะกร้า
                        </button>
                        <button onClick={() => handleAddToCartAndGoToCart(productData._id)} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                            เพิ่ม และ ไปที่ตะกร้า
                        </button>
                    </div>
                    <div className="flex items-center mt-10 gap-4">                 
                        <button
                            onClick={handleNextProduct}
                            className="w-full py-3.5 bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                             ลายก่อนหน้า
                        </button>

                        <button
                            onClick={handlePreviousProduct}
                            className="w-full py-3.5 bg-blue-500 text-white hover:bg-blue-600 transition"
                        >                           
                           ลายถัดไป
                        </button>
                    </div>
                </div>
            </div>

            {/* product slice  */}
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Embroidery</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <Link href={'/'} className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    กดดูลายทั้งหมด
                </Link>
            </div>

            {/* Modal for image preview */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-orange-200 bg-opacity-75 flex items-center justify-center z-50 "
                    onClick={() => setIsModalOpen(false)} // Close modal on background click
                >
                    <div className="relative">
                        <button
                            className="absolute top-4 right-4 text-slate-900 text-2xl "
                            onClick={() => setIsModalOpen(false)} // Close modal on button click
                        >
                            &times;
                        </button>
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-auto h-auto max-w-screen max-h-screen p-8 bg-white rounded-lg"
                            width={1920}
                            height={1080}
                        />
                    </div>
                </div>
            )}
        </div>

    </>
    ) : <Loading />
};

export default Product;