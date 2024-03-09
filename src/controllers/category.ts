import { Request } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { Category } from '../models/categories.js';
import ErrorHandler from '../utils/utility-class.js';
import { NewCategoryRequestBody } from '../types/types.js';

export const addNewCategory = TryCatch(async (req: Request<{}, {}, NewCategoryRequestBody>, res, next) => {
	const { name } = req.body;
	const file = req.file;

	if (!name || !file) {
		return next(new ErrorHandler('Please add all fields', 400));
	}

	await Category.create({ name, photo: file.path });

	return res.status(201).json({
		success: true,
		message: 'Category created successfully',
	});
});

export const getAllCategories = TryCatch(async (req, res, next) => {
	const categories = await Category.find({});

	return res.status(201).json({
		success: true,
		categories,
	});
});
export const getCategoryDetails = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		return next(new ErrorHandler('Category not found', 404));
	}
	return res.status(201).json({
		success: true,
		category,
	});
});

export const deleteCategory = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		return next(new ErrorHandler('Category not found', 404));
	}
	await category.deleteOne();

	return res.status(201).json({
		success: true,
		message: `Category ${category.name} deleted successfully`,
	});
});

export const updateCategory = TryCatch(async (req: Request<any, {}, NewCategoryRequestBody>, res, next) => {
	const { id } = req.params;
	const { name } = req.body;
	const file = req.file;
	const category = await Category.findById(id);

	if (!category) {
		return next(new ErrorHandler('Category not found', 404));
	}

	if (!name && !file) {
		return next(new ErrorHandler('Add field to update', 400));
	}

	await category.updateOne({ name, photo: file?.path });

	return res.status(201).json({
		success: true,
		message: `Category ${category.name} update successfully`,
	});
});
