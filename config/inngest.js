import { Inngest } from "inngest";

import User from "@/models/User";
import Order from "@/models/Order";
import connectDB from "./db";
// import Product from "@/models/Product";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

// inngest Function to update user data to database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/uxer.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// inngest Function to delet user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-eith-clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)


export const createUserOrder = inngest.createFunction(
    {
        id: 'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    { event: 'order/created' },
    async ({ events }) => {
        try {
            await connectDB();

            const orders = await Promise.all(
                events.map(async (event) => {
                    const { userId, items, amount, address, date, paySlip } = event.data;

                    // Validate required fields
                    if (!userId || !items || !amount || !address || !date || !paySlip) {
                        throw new Error("Missing required order fields");
                    }

                    // Fetch the user's email from the database
                    const user = await User.findById(userId);
                    if (!user) {
                        throw new Error(`User with ID ${userId} not found`);
                    }  

                    return {
                        userId,
                        email: user.email, // Add the user's email
                        items, 
                        paySlip,                    
                        amount,
                        address,
                        date
                    };
                })
            );

            await Order.insertMany(orders);

            return { success: true, processed: orders.length };
        } catch (error) {
            console.error("Error processing orders:", error.message);
            return { success: false, message: error.message };
        }
    }
);