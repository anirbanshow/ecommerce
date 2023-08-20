import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';

// create category
export const createCategoryController = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(401).send({ message: "Name is Required" });
        }

        const existingCategory = await categoryModel.findOne({ name });

        if (existingCategory) {
            return res.status(401).send({
                success: true,
                message: "Category already exists",
            });
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save();

        res.status(200).json({
            success: true,
            message: "new category created",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in category",
            error
        });
    }
}

// update category
export const updateCategoryController = async (req, res) => {
    try {

        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(401).send({ message: "Name is Required" });
        }

        if (!id) {
            return res.status(401).send({ message: "id is Required" });
        }

        const category = await categoryModel.findByIdAndUpdate(id, {
            name, slug: slugify(name)
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating category",
            error
        });
    }
}

// get all categories
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find();

        return res.status(200).send({
            success: true,
            message: "All Category List",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting all category",
            error
        });
    }
}

// single category
export const singleCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug });

        return res.status(401).send({
            success: true,
            message: "Get Single Category Successfully",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single category",
            error
        });
    }
}

// delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting category",
            error
        });
    }
}