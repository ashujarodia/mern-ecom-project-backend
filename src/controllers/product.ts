import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import { rm } from 'fs';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product.js';
import { NewProductRequestBody } from '../types/types.js';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';
import ErrorHandler from '../utils/utility-class.js';

export const newProduct = TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
	const { name, price, stock, category, description } = req.body;

	const photo = req.file;

	if (!photo) {
		return next(new ErrorHandler('Please add photo', 400));
	}

	const localFilePath = `public/temp/${photo.filename}`;

	const imgRes = await uploadImageToCloudinary(localFilePath);

	if (!name || !price || !stock || !category || !description) {
		rm(photo.path, () => {
			console.log('Deleted');
		});
		return next(new ErrorHandler('Please fill all fields', 400));
	}
	const product = await Product.create({
		name,
		price,
		stock,
		category: category.toLowerCase(),
		photo: {
			url: imgRes.url,
			public_id: imgRes.public_id,
		},
		description,
	});

	return res.status(201).json({
		success: true,
		message: 'Product created successfully',
		product,
	});
});

export const getAllProducts = TryCatch(async (req, res, next) => {
	const products = await Product.find({});

	return res.status(201).json({
		success: true,
		products,
	});
});

export const getLatestProducts = TryCatch(async (req, res, next) => {
	const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

	return res.status(201).json({
		success: true,
		products,
	});
});

export const getFeaturedProducts = TryCatch(async (req, res, next) => {
	const products = await Product.find({ featured: true });

	return res.status(201).json({
		success: true,
		products,
	});
});

export const getPopularProducts = TryCatch(async (req, res, next) => {
	const products = await Product.find({ rating: { $gte: 4 } });

	return res.status(201).json({
		success: true,
		products,
	});
});

export const getProductDetails = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findById(id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	return res.status(201).json({
		success: true,
		product,
	});
});

export const getSimilarProducts = TryCatch(async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findById(id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	const similarProducts = await Product.find({ category: product.category, _id: { $ne: id } });

	return res.status(201).json({
		success: true,
		products: similarProducts,
	});
});

export const updateProduct = TryCatch(async (req, res, next) => {
	const { id } = req.params;

	const { name, price, stock, category, description, featured } = req.body;
	const photo = req.file;

	let product = await Product.findById(id);
	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	// Update product fields
	if (name) product.name = name;
	if (price) product.price = price;
	if (stock) product.stock = stock;
	if (category) product.category = category;
	if (description) product.description = description;
	if (featured) product.featured = featured;

	// If a new photo is uploaded, replace the old photo in Cloudinary
	if (photo) {
		// Delete the old image from Cloudinary
		try {
			await cloudinary.uploader.destroy(product.photo?.public_id!);
		} catch (error) {
			console.error('Error deleting old image from Cloudinary:', error);
		}

		const localFilePath = `public/temp/${photo.filename}`;
		const imgRes = await uploadImageToCloudinary(localFilePath);
		product.photo.url = imgRes.secure_url;
		product.photo.public_id = imgRes.public_id;
	}

	await product.save();

	return res.status(200).json({
		success: true,
		message: 'Product updated successfully',
		product,
	});
});

export const deleteProduct = TryCatch(async (req, res, next) => {
	const { id } = req.params;

	const product = await Product.findById(id);
	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	// Delete the image from Cloudinary
	try {
		await cloudinary.uploader.destroy(product.photo.public_id);
	} catch (error) {
		console.error('Error deleting image from Cloudinary:', error);
	}

	// Delete the product from the database
	await product.deleteOne();

	return res.status(200).json({
		success: true,
		message: 'Product deleted successfully',
	});
});
