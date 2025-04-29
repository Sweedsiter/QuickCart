import mongoose from "mongoose";

const productUrlSchema = new mongoose.Schema({
    product_id: { type: String, required: true, ref: "Product" }, // Reference to the Product model
    filesUrl: [{ type: String, required: true }], // Array of image URLs
    date: { type: Date, default: Date.now }, // Date of upload
});

const ProductUrl = mongoose.models.ProductUrl || mongoose.model("product_file", productUrlSchema);

export default ProductUrl;