
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
        // const { userId } = getAuth(request);

        // const isSeller = await authSeller(userId);

        // if (!isSeller) {
        //     return NextResponse.json({ success: false, message: "Not authorized" });
        // }

        const formData = await request.formData();
        const file = formData.get("file"); // Get a single file

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" });
        }

        // Convert file to buffer and upload to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(buffer);
        });

        const fileUrl = uploadResult.secure_url;

        return NextResponse.json({
            success: true,
            message: "Upload successful",
            fileUrl,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}