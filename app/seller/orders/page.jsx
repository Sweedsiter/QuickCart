'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user, router, isSeller } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
    const [loading, setLoading] = useState(true);
    const [orderSendIds, setOrderSendIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    //show slip
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

    // Fetch seller orders
    const fetchSellerOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/seller-order');

            if (data.success) {
                const sortedOrders = data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
                setFilteredOrders(sortedOrders); // Initialize filtered orders
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };



    // Fetch processed order IDs from Order_send
    const fetchOrderSendIds = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/order/order-send', { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                // Store both order_id and date
                const processedOrders = data.orders.map((orderSend) => ({
                    order_id: orderSend.order_id,
                    date: orderSend.date
                }));
                setOrderSendIds(processedOrders);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if(!isSeller){
            router.push('/')
          }
        if (user) {
            fetchSellerOrders();
            fetchOrderSendIds();
        }
    }, [user]);


    // FileId Check
    const fileId = async (id) => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`/api/order/update-product-order?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                toast.success("Product order Update successfully");
                fetchOrderSendIds();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred order Update");
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = orders.filter((order) =>
            order.items.some((item) =>
                item.product.name.toLowerCase().includes(query.toLowerCase())
            )
        );
        setFilteredOrders(filtered);
    };

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="flex justify-between items-center">
                    <p className="text-gray-500">Total Orders: {filteredOrders.length}</p>    
                    <div className="my-4">
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>            
                    <p className="text-gray-500">Total Amount: {currency}{orders.reduce((acc, order) => acc + order.amount, 0).toFixed(2)}</p>
                </div>
                <div className="rounded-md">
                    {filteredOrders.map((order) => (
                        order.items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                                <div onClick={() => router.push(`/product/${item.product._id}`)} className="flex-1 flex gap-5 max-w-80">
                                    <img
                                        className="max-w-16 max-h-16 object-cover"
                                        src={item.product.image}
                                        alt={item.product.name}
                                    />
                                    <p className="flex flex-col gap-3">
                                        <span className="font-medium ">
                                            {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                        </span>
                                        <span>Items : {order.items.length}</span>
                                    </p>
                                </div>


                                <div>
                                    <p>
                                        <span className="font-medium">{order.address.fullName}</span>
                                        <br />
                                        <span>{order.address.phoneNumber}</span>
                                        <br />
                                        <span>
                                            {order.email}
                                        </span>

                                    </p>
                                </div>

                                <p className="font-medium my-auto">{currency}{item.product.offerPrice}</p>

                                {/* <p className="font-medium my-auto">{currency}{order.amount}</p> */}

                                <div>
                                    <p className="flex flex-col">
                                        <span>Method : COD</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span>Payment : Pending</span>
                                    </p>
                                </div>
                                <div>
                                    <h1>Status</h1>
                                    {orderSendIds.some((orderSend) => orderSend.order_id === item._id.toString()) ? (
                                        <p className="text-green-600">
                                            Processed: Date {new Date(orderSendIds.find((orderSend) => orderSend.order_id === item._id.toString()).date).toLocaleDateString()}
                                        </p>
                                    ) : (
                                        <button
                                            className="bg-red-600 text-white p-2 my-2 rounded rounded-lg"
                                            onClick={() => fileId(item._id)}
                                        >
                                            Send File
                                        </button>
                                    )}
                                </div>

                                <div>
                                    {order.paySlip ? (
                                        <img
                                            src={order.paySlip}
                                            alt="Payment Slip"
                                            className="max-w-12 max-h-12 object-cover mt-2"
                                            onClick={() => handleImageClick(order.paySlip)} // Open modal on click
                                        />
                                    ) : (
                                        <p className="text-red-600">ยังไม่ชำระ</p>
                                    )}
                                    {isModalOpen && (
                                        <div onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                            <img
                                                src={modalImage}
                                                alt="Enlarged Payment Slip"
                                                className="max-w-full max-h-screen object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default Orders;