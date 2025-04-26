
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function GET() {    
    try {      
        await connectDB()  
        const userData = await  User.find({})
        return NextResponse.json({ success: true , userData })
    } catch (error) {
        return NextResponse.json({ success: false , message: error.message})
    }
}