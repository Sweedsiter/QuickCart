
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
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

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return new Response(JSON.stringify({ success: false, message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, product }), {
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