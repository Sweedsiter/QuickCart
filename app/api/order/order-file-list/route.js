import connectDB from "@/config/db";
import OrderSend from "@/models/Order_send";
import { NextResponse } from "next/server";


export async function GET() {    
    try {   
        await connectDB()
        const Order_send = await OrderSend.find({})
        return NextResponse.json({ success: true , Order_send})
    } catch (error) {
        return NextResponse.json({ success: false , message: error.message})
    }
}