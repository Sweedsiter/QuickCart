import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request) {

    try {
        const { userId } = getAuth(request)

        const { address, items , paySlip} = await request.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        if (!paySlip) {
            return NextResponse.json({ success: false, message: 'Invalid data paySlip' });
        }   

        // calcuatr amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)

            return await acc + product.offerPrice * item.quantity;
        }, 0)

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,   
                paySlip: paySlip,            
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now(),
            },
        });


        // clear user cart
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }
        user.cartItems = {};
        await user.save();
        return NextResponse.json({ success: true, message: 'Order Placed' })

    } catch (error) {
      
        return NextResponse.json({ success: false, message: error.message })
    }
}