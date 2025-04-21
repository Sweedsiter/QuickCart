import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function DELETE(request) {
  try {
    // Connect to the database
    await connectDB();

    // Extract product ID from the query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return new Response(JSON.stringify({ success: false, message: "Product ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Check if the product is associated with any order
    const orderWithProduct = await Order.findOne({ "items.product": productId });

    if (orderWithProduct) {
      return new Response(JSON.stringify({ success: false, message: "Product นี้ลบออกไม่ได้เนื่องจากว่าคุณมี Order" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

     // Find and delete the product
     const deletedProduct = await Product.findByIdAndDelete(productId);

    // Find and delete the product  
    if (!deletedProduct) {
      return new Response(JSON.stringify({ success: false, message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Product deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

