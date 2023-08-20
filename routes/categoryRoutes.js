import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
    createCategoryController,
    updateCategoryController,
    categoryController,
    singleCategoryController,
    deleteCategoryController
} from '../controllers/CategoryController.js';

const router = express.Router();

// routes

// create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// update category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// getALL  category
router.get("/get-category", categoryController);

// Single  category
router.get("/single-category/:slug", singleCategoryController);

// Single  category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);


export default router;
