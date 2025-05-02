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

        // Check if the item_id exists in the  Order collection
        const order = await Order.findOne({ "items._id": item_id });
        if (!order) {
            return NextResponse.json({ success: false, message: "Order ยังไม่มีในระบบ กรุณาลองอีกครั้ง" });
        }
        // Find the specific item in the order's items array
        const matchingItem = order.items.find((item) => item._id.toString() === item_id);
        if (!matchingItem) {
            return NextResponse.json({ success: false, message: "Item not found in the order" });
        }

        // Check if the item_id exists in the product-files collection
        const productFile = await ProductFile.findOne({ product_id: matchingItem.product });
        if (!productFile) {
            return NextResponse.json({ success: false, message: "Product File url found" });
        }

        // Add new data to the productFile
        const newOrderSend = {
            userId: order.userId,
            order_id: matchingItem._id,
            productfile_id: matchingItem.product,
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