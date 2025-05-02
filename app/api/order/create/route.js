import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable body parsing for `multipart/form-data`
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        // Parse the incoming form data
        const form = new formidable.IncomingForm();
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const { address, items } = JSON.parse(fields.data); // Parse JSON fields
        const file = files.file; // Access the uploaded file

        if (!address || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        if (!file) {
            return NextResponse.json({ success: false, message: "File is required" });
        }

        console.log("Uploaded file:", file);

        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.filepath, {
            folder: "orders",
        });

        console.log("Cloudinary upload result:", uploadResult);

        // Calculate the total amount
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return await acc + product.offerPrice * item.quantity;
        }, 0);

        console.log("Order items:", items);

        // Send order creation event
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                fileUrl: uploadResult.secure_url, // Include the uploaded file URL
                date: Date.now(),
            },
        });

        // Clear user cart
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}