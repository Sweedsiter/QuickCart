import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    order_id: { type: String, required: true },
    productfile_id: { type: String, required: true },
    filesUrl: { type: Array, required: true },
    date: { type: Number, required: true }
})

const Order_send = mongoose.models.Order_send || mongoose.model('order_send', orderSchema)
export default Order_send


