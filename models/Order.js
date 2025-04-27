import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    email: { type: String, required: true },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true },
    }],
    itemsWithImages: [
        {
            image: { type: String , required: true },
            product: { type: String, required: true, ref: 'product' },
            quantity: { type: Number, required: true },
        }
    ], // Add image field for the product
    amount: { type: Number, required: true },
    address: { type: String, ref: 'address', required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    date: { type: Number, required: true }
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)


export default Order


