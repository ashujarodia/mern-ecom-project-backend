import { Request } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { Category } from '../models/categories.js';
import ErrorHandler from '../utils/utility-class.js';
import { NewCategoryRequestBody } from '../types/types.js';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

export const addNewCategory = TryCatch(async (req: Request<{}, {}, NewCategoryRequestBody>, res, next) => {
	const { name } = req.body;
	const photo = req.file;

	if (!name || !photo) {
		return next(new ErrorHandler('Please add all fields', 400));
	}

	const localFilePath = `temp/${photo.filename}`;

	const imgRes = await uploadImageToCloudinary(localFilePath);

	await Category.create({
		name,
		photo: {
			url: imgRes.url,
			public_id: imgRes.public_id,
		},
	});

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

	// Delete the image from Cloudinary
	try {
		await cloudinary.uploader.destroy(category.photo.public_id);
	} catch (error) {
		console.error('Error deleting image from Cloudinary:', error);
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
	const photo = req.file;
	const category = await Category.findById(id);

	if (!category) {
		return next(new ErrorHandler('Category not found', 404));
	}

	if (!name && !photo) {
		return next(new ErrorHandler('Add field to update', 400));
	}

	if (name) {
		category.name = name;
	}

	// If a new photo is uploaded, replace the old photo in Cloudinary
	if (photo) {
		// Delete the old image from Cloudinary
		try {
			await cloudinary.uploader.destroy(category.photo.public_id);
		} catch (error) {
			console.error('Error deleting old image from Cloudinary:', error);
		}

		const localFilePath = `temp/${photo.filename}`;
		const imgRes = await uploadImageToCloudinary(localFilePath);
		category.photo.url = imgRes.secure_url;
		category.photo.public_id = imgRes.public_id;
	}

	await category.save();

	return res.status(201).json({
		success: true,
		message: `Category ${category.name} update successfully`,
	});
});
