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

        // Check if the item_id exists in the product-files collection
        const productFile = await ProductFile.findOne({ product_id: item_id });

        if (!productFile) {
            return NextResponse.json({ success: false, message: "Product File url found" });
        }
        const order = await Order.findOne({ "items.product": item_id });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found for the given product" });
        }

        const matchingItem = order.items.find((item) => item.product === item_id);

        if (!matchingItem) {
            return NextResponse.json({ success: false, message: "Item not found in the order" });
        }  
        const OrderSended = await Order_send.findOne({order_id: matchingItem._id})

        if(OrderSended){
            return NextResponse.json({ success: false, message: "This is Item Haved" });
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