import connectDB from "@/config/db";
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

         
 
         return NextResponse.json({ success: true, productFile });
    } catch (error) {       
        return NextResponse.json({ success: false, message: error.message || "api ล้มเลว" });
    }
}