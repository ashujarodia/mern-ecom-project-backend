import { Request } from 'express';
import { rm } from 'fs';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product.js';
import { NewProductRequestBody } from '../types/types.js';
import ErrorHandler from '../utils/utility-class.js';

export const newProduct = TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
	const { name, price, stock, category, description } = req.body;
	const photo = req.file;

	if (!photo) {
		return next(new ErrorHandler('Please add photo', 400));
	}

	if (!name || !price || !stock || !category || !description) {
		rm(photo.path, () => {
			console.log('Deleted');
		});
		return next(new ErrorHandler('Please fill all fields', 400));
	}
	await Product.create({ name, price, stock, category: category.toLowerCase(), photo: photo.path, description });

	return res.status(201).json({
		success: true,
		message: 'Product created successfully',
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
	console.log('id : ' + id);
	console.log(req.body);

	const { name, price, stock, category, description, featured } = req.body;
	console.log('name : ' + name);

	const photo = req.file;

	const product = await Product.findById(id);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}
	if (photo) {
		rm(product.photo, () => {
			console.log('Old photo deleted');
		});
		product.photo = photo.path;
	}
	if (name) product.name = name;
	if (price) product.price = price;
	if (stock) product.stock = stock;
	if (category) product.category = category;
	if (description) product.description = description;
	if (featured) product.featured = featured;

	await product.save();

	return res.status(201).json({
		success: true,
		message: 'Product Updated Successfully',
		product,
	});
});

export const deleteProduct = TryCatch(async (req, res, next) => {
	const { id } = req.params;

	const product = await Product.findById(id);
	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}
	rm(product.photo, () => {
		console.log('Photo deleted');
	});
	await product.deleteOne();

	return res.status(201).json({
		success: true,
		message: 'Product deleted Successfully',
	});
});
