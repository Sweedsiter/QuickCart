'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user, router , address } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderSendIds, setOrderSendIds] = useState(new Set());

    // Fetch seller orders
    const fetchSellerOrders = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/order/seller-order', { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                setOrders(data.orders);
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

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="rounded-md">
                    {orders.map((order) => (
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
                            </div>
                        ))

                    ))}
                </div>
            </div>}

            <Footer />
        </div>
    );
};

export default Orders;