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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken()
                const { data } = await axios.get('/api/order/list', { headers: { Authorization: `Bearer ${token}` } })
                if (data.success) {
                    setOrders(data.orders.reverse())
                    setLoading(false)
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }

        }

        const fetchOrder_file = async () => {
            try {
                const { data } = await axios.get('/api/order/order-file-list')
                if (data.success) {
                    setOrder_file(data.Order_send)
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }

        }
        if (user) {
            fetchOrders();
            fetchOrder_file();
        }
    }, [user]);
    console.log(Order_file)
    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (<div className=" border-t border-gray-300 text-sm">
                        {orders.map((order) => (
                            order.items.map((item, index) => (
                                <div key={index}  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                    <div onClick={() => router.push(`/product/${item.product._id}`)} className="flex-1 flex gap-5 max-w-80" >
                                        <img
                                            className="max-w-16 max-h-16 object-cover"
                                            src={item.product.image}
                                            alt={item.product.name}
                                        />
                                        <p className="flex flex-col gap-3">
                                            <span className="font-medium text-base">
                                                {item.product.name }
                                            </span>
                                            <span>Items : {order.items.length}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="font-medium">{order.address.fullName}</span>
                                            <br />
                                            <span>{order.email}</span>
                                            <br />
                                            {/* <span >{order.address.area}</span>
                                        <br />
                                        <span>{`${order.address.city}, ${order.address.state}`}</span>
                                        <br /> */}
                                            <span>{order.address.phoneNumber}</span>
                                        </p>
                                    </div>
                                    <p className="font-medium my-auto">{currency}{item.product.offerPrice}</p>
                                    <div>
                                        <p className="flex flex-col">
                                            <span>Method : COD</span>
                                            <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                            <span>Payment : Pending</span>
                                        </p>
                                    </div>
                                    <div>
                                        <h1>Status</h1>
                                        {Order_file && Order_file.some((file) => file.order_id === item._id) ? (
                                            <div> 
                                                  <p >No:1.Wilcom / 2.PES / 3.DST  </p>
                                                {Order_file.filter((file) => file.order_id === item._id).map((file, index) => (
                                                    <div key={index}>
                                                        {file.filesUrl.map((fileUrl, fileIndex) => (
                                                            <a
                                                                key={fileIndex}
                                                                href={fileUrl} // File URL
                                                                download={fileUrl} // Suggested file name
                                                                className="text-blue-600 underline pr-4"
                                                            >
                                                                Download 
                                                            </a>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-red-600">รอแอดมินอนุมัติ</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;