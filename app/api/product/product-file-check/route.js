import connectDB from "@/config/db";
import ProductUrl from "@/models/Product-Url";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {  
        await connectDB();      
        const { searchParams } = new URL(request.url);
        const product_id = searchParams.get("id");
   
        if (!product_id) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }
        const product = await ProductUrl.findOne({ product_id: product_id });
        if (!product) {
            return NextResponse.json({ success: false, message: "Product File ยังไม่เคยมีในระบบ" });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {       
        return NextResponse.json({ success: false, message: error.message || "api ล้มเลว" });
    }
}