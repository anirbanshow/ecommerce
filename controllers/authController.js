import userModel from '../models/userModal.js';
import orderModel from '../models/orderModel.js';

import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

// POST Register
export const registerController = async (req, res) => {
    try {

        const { name, email, password, phone, address, answer } = req.body;

        // validation
        if (!name) {
            return res.send({ message: "Name is Required" });
        }

        if (!email) {
            return res.send({ message: "Email is Required" });
        }

        if (!password) {
            return res.send({ message: "Password is Required" });
        }

        if (!phone) {
            return res.send({ message: "Phone no is Required" });
        }

        if (!address) {
            return res.send({ message: "Address is Required" });
        }

        if (!answer) {
            return res.send({ message: "Answer is Required" });
        }

        // check user
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered please Login",
            });
        }

        // register user
        const hashedPassword = await hashPassword(password);

        // saved
        const user = await new userModel({
            name, email, phone, address, answer, password: hashedPassword
        }).save();

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error is Registration",
            error
        });
    }
}

// POST Login
export const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        // check user
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }

        // token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error is Registration",
            error
        });
    }
}

// Forgot Password controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is Required" });
        }

        if (!answer) {
            return res.status(400).send({ message: "Answer is Required" });
        }

        if (!newPassword) {
            return res.status(400).send({ message: "New PAssword is Required" });
        }

        // check
        const user = await userModel.findOne({ email, answer });

        // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer",
            });
        }

        const hashed = await hashPassword(newPassword);

        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
};

// Test controller
export const testController = (req, res) => {
    res.send("Protected Routes");
}

// update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, password, phone, address } = req.body;

        const user = await userModel.findById(req.user._id);

        // password
        if (!password && password.length) {
            return res.json({
                error: "Password is required and 6 characters long"
            })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, { new: true });

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}

// orders
export const getOrdersController = async (req, res) => {
    try {

        const orders = await orderModel.find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");

        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}

// all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });

        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}

// order status update
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}