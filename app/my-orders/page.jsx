'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
    const { currency, getToken, user, router } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [Order_file, setOrder_file] = useState();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // State for search input

    // paySlip show
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };


    const fetchOrders = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/order/list', { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setOrders(data.orders.reverse());
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const fetchOrder_file = async () => {
        try {
            const { data } = await axios.get('/api/order/order-file-list');
            if (data.success) {
                setOrder_file(data.Order_send);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchOrder_file();
        }
    }, [user]);

    // Filter orders based on the search term
    const filteredOrders = orders.filter((order) =>
        order.items.some((item) =>
            item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="ค้นหาตามชื่อ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-fit mb-4"
                    />
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="border-t border-gray-300 text-sm">
                            {filteredOrders.map((order) =>
                                order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                                    >
                                        <div
                                            onClick={() =>
                                                router.push(`/product/${item.product._id}`)
                                            }
                                            className="flex-1 flex gap-5 max-w-80"
                                        >
                                            <img
                                                className="max-w-16 max-h-16 object-cover"
                                                src={item.product.image}
                                                alt={item.product.name}
                                            />
                                            <p className="flex flex-col gap-3">
                                                <span className="font-medium text-base">
                                                    {item.product.name}
                                                </span>
                                                <span>Items : {order.items.length}</span>
                                            </p>
                                        </div>

                                        <div>
                                            <p className="flex flex-col">
                                                <span>Youre : Email</span>
                                                <span>{order?.email || "No Email Provided"}</span>
                                            </p>
                                        </div>

                                        <p className="font-medium my-auto">
                                            {currency}
                                            {item.product.offerPrice}
                                        </p>
                                        <div>
                                            <p className="flex flex-col">
                                                <span>Method : COD</span>
                                                <span>
                                                    Date :{" "}
                                                    {new Date(
                                                        order.date
                                                    ).toLocaleDateString()}
                                                </span>


                                            </p>
                                        </div>

                                        <div>
                                            <h1>Status</h1>
                                            {Order_file &&
                                                Order_file.some(
                                                    (file) =>
                                                        file.order_id === item._id
                                                ) ? (
                                                <div>
                                                    {Order_file.filter(
                                                        (file) =>
                                                            file.order_id ===
                                                            item._id
                                                    ).map((file, index) => (
                                                        <div key={index} className="mt-4">
                                                            <p className="">1.Wilcon / 2.PES / 3.DST โหลดได้แล้ว..... </p> <br/>
                                                            {file.filesUrl.map(
                                                                (
                                                                    fileUrl,
                                                                    fileIndex
                                                                ) => (
                                                                    <a
                                                                        key={
                                                                            fileIndex
                                                                        }
                                                                        href={
                                                                            fileUrl
                                                                        }
                                                                        download={
                                                                            fileUrl
                                                                        }
                                                                        className="text-white mr-4  bg-green-600 px-2 py-1"
                                                                    >
                                                                        Download
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-red-600">
                                                    รอแอดมินอนุมัติ
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            
                                            <p className="flex flex-col">
                                            <span>สลิปโอน</span>
                                                {/* Display paySlip image */}
                                                {order.paySlip ? (
                                                    <img
                                                        src={order.paySlip}
                                                        alt="Payment Slip"
                                                        className="max-w-12 max-h-fit object-cover mt-2 cursor-pointer"
                                                        onClick={() => handleImageClick(order.paySlip)} // Open modal on click
                                                    />
                                                ) : (
                                                    <p className="text-red-600">คุณยังไม่ได้ชำระ</p>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <span className="text-red-600 ">
                    สินค้าไม่แสดงไม่ต้องตกใจ Server กำลังเก็บข้อมูล ลอง Reload ใหม่อีกรอบ
                    ไฟล์งานรออนุมัติภายใน 24ชม. หากต้องใช้งานด่วน หรึอ สอบถามเพิ่มเติม โทร 091 045 5990
                </span>

                {isModalOpen && (
                    <div onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="relative">
                            <img
                                src={modalImage}
                                alt="Enlarged Payment Slip"
                                className="max-w-full max-h-screen object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default MyOrders;