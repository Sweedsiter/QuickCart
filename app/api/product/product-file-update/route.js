import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import ProductUrl from "@/models/Product-Url";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const formData = await request.formData();

        const product_id = formData.get("product_id"); 
        const wilcom = formData.get("wilcom"); 
        const pes = formData.get("pes"); 
        const dst = formData.get("dst"); 

        const files = [wilcom, pes, dst].filter(Boolean); 

        if (!product_id || files.length === 0) {
            return NextResponse.json({ success: false, message: "Missing product ID or files" });
        }

        // Upload files to Cloudinary
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const fileName = file.name; // Extract the original file name
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'raw', public_id: fileName.split('.jpg')[0] },
                        (error, result) => {
                            if (error) {
                                reject(error); // Reject the promise if there's an error
                            } else {
                                resolve({
                                    url: result.secure_url, // Cloudinary URL
                                    name: fileName, 
                                }); 
                            }
                        }
                    );
                    stream.end(buffer); // Send the file data to Cloudinary
                });
            })
        );

        const filesUrl = uploadedFiles.map((result) => result.url);

        await connectDB();

        // Update the product's files in the database
        const updatedProduct = await ProductUrl.findOneAndUpdate(
            { product_id }, 
            { $push: { filesUrl: { $each: filesUrl } }, date: Date.now() }, 
            { new: true, upsert: false } 
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }

        return NextResponse.json({
            success: true,
            message: "Files updated successfully",
            updatedProduct,
        });
    } catch (error) {
        console.error("Error in /api/product/product-file-update:", error); // Log the full error object
        return NextResponse.json({
            success: false,
            message: error.message || "An unexpected error occurred",
        });
    }
}