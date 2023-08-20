import JWT from 'jsonwebtoken';
import userModal from '../models/userModal.js';

// Project Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Unauthorized access denied",
            error
        });
    }
}

// admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModal.findById(req.user._id);

        if (user.role !== 1) {
            res.status(200).send({
                success: false,
                message: "UnAuthorized Access",
            });
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error is Admin Middleware",
            error
        });
    }
}