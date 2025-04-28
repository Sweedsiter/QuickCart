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
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        const formData = await request.formData();

        const producu_id = formData.get('product_id'); // Get product ID
        const files = formData.getAll('files'); // Get all uploaded files    

        if (!producu_id || files.length === 0) {
            return NextResponse.json({ success: false, message: 'Missing product ID or files' });
        }

        // Upload files to Cloudinary
        const result = await Promise.all(
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
                                    secure_url: result.secure_url, // Cloudinary URL
                                    fileName, // Include the original file name
                                }); // Resolve the promise with the result
                            }
                        }
                    );
                    stream.end(buffer); // Send the file data to Cloudinary
                });
            })
        );
        const filesUrl = result.map((result) => result.secure_url); // Extract secure URLs
        
        await connectDB();
        const newProductFiles = await ProductUrl.create({
            producu_id,
            filesUrl,
            date: Date.now(),
        });

        return NextResponse.json({
            success: true,
            message: 'Upload Files successful',
            newProductFiles,
        });
    } catch (error) {
        console.error('Error in /api/product/product-file:', error); // Log the full error object
        return NextResponse.json({
            success: false,
            message: error.message || 'An unexpected error occurred',
        });
    }
}