import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema(
    {
        products: [
            {
                type: mongoose.ObjectId,
                ref: "Products"
            }
        ],
        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: "users"
        },
        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]
        }
    },
    { timestamps: true }
);

export default mongoose.model("Order", ordersSchema);