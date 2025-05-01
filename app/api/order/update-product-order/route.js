import connectDB from "@/config/db";
import Order from "@/models/Order";
import Order_send from "@/models/Order_send";
import ProductFile from "@/models/Product-Url";
import { NextResponse } from "next/server";





export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const item_id = searchParams.get("id");

        if (!item_id) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }
        console.log("params", item_id)

        // Check if the item_id exists in the product-files collection
        const productFile = await ProductFile.findOne({ product_id: item_id });

        if (!productFile) {
            return NextResponse.json({ success: false, message: "Product File url found" });
        }
        console.log("ProductFile", item_id)


        // Check if the item_id exists in the  Order collection
        const order = await Order.findOne({ "items.product": item_id });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found for the given product" });
        }


        // Extract all product IDs from the order's items
        const Order_items =await order.items.map((item) => item.product);
        console.log("Order_items", Order_items);

        // Check if the item_id exists in the Order_items array
        const iii = await Order_items.some((e) => e === item_id);      
        console.log("iii ", iii );

        const matchingItem = order.items.find((item) => item.product === item_id);             
        console.log("matchingItem ",matchingItem );


        // Check if the item has already been processed in Order_send
        const OrderSended = await Order_send.findOne({ order_id: order._id, productfile_id: productFile.product_id });

        if (OrderSended) {
            return NextResponse.json({ success: false, message: "This item has already been processed" });
        }

        // Add new data to the productFile
        const newOrderSend = {
            order_id: matchingItem._id,
            productfile_id: productFile.product_id,
            filesUrl: productFile.filesUrl,
            date: Date.now()
        };

        const createdOrder = await Order_send.create(newOrderSend);
        return NextResponse.json({ success: true, createdOrder });
    } catch (error) {
        console.error("Error creating Order_send:", error.message);
        return NextResponse.json({ success: false, message: error.message || "api ล้มเลว" });
    }
}