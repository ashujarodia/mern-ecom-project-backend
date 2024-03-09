import { Request } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { Cart } from '../models/cart.js';
import { Product } from '../models/product.js';
import { NewCartItemRequestBody } from '../types/types.js';
import ErrorHandler from '../utils/utility-class.js';
import { updateCartSubtotal } from '../utils/features.js';

export const addToCart = TryCatch(async (req: Request<{}, {}, NewCartItemRequestBody>, res, next) => {
	const { _id } = req.user;
	const { productId, quantity } = req.body;

	if (!productId) {
		return next(new ErrorHandler('Product id is required', 400));
	}

	const product = await Product.findById(productId);
	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	let cart = await Cart.findOne({ userId: _id }).populate('items.product');
	if (!cart) {
		cart = new Cart({
			userId: _id,
			items: [],
			subtotal: 0,
			tax: 0,
			shippingCharges: 0,
			total: 0,
		});
	}

	// Check if the product already exists in the cart
	const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

	if (existingItemIndex !== -1) {
		// Update quantity if the product already exists in the cart
		cart.items[existingItemIndex].quantity += quantity || 1;
	} else {
		// Add new item to the cart
		cart.items.push({ product: productId, quantity, price: product.price });
	}

	// Save the cart
	await cart.save();
	await updateCartSubtotal(cart._id);

	return res.status(200).json({
		success: true,
		message: 'Added to cart successfully',
	});
});

export const getCartItems = TryCatch(async (req, res, next) => {
	const { _id } = req.user;

	const cart = await Cart.find({ userId: _id }).populate('items.product');

	return res.status(200).json({
		success: true,
		cart,
	});
});

export const removeFromCart = TryCatch(async (req, res, next) => {
	const { _id } = req.user;
	const { productId } = req.params;

	if (!productId) {
		return next(new ErrorHandler('Product id is required', 400));
	}

	// Find the cart for the user
	const cart = await Cart.findOne({ userId: _id });

	if (!cart) {
		return next(new ErrorHandler('Cart not found', 404));
	}

	// Find the index of the item in the cart
	const index = cart.items.findIndex((item) => item.product.toString() === productId);

	if (index === -1) {
		return next(new ErrorHandler('Item not found in cart', 404));
	}

	// Remove the item from the cart
	cart.items.splice(index, 1)[0];

	// Save the cart
	await cart.save();
	await updateCartSubtotal(cart._id);
	return res.status(200).json({
		success: true,
		message: 'Item removed from cart successfully',
	});
});

export const emptyCart = TryCatch(async (req, res, next) => {
	const { _id } = req.user;
	const cart = Cart.findOne({ userId: _id });
	if (!cart) {
		return next(new ErrorHandler('Cart not found', 404));
	}
	await cart.deleteOne();

	return res.status(200).json({
		success: true,
		message: 'Cart empty successfully',
	});
});

export const increaseQuantity = TryCatch(async (req, res, next) => {
	const { _id } = req.user;
	const { productId } = req.params;

	if (!productId) {
		return next(new ErrorHandler('Product id is required', 400));
	}
	// Find the cart for the user
	const cart = await Cart.findOne({ userId: _id });

	if (!cart) {
		return next(new ErrorHandler('Cart not found', 404));
	}

	// Find the item in the cart
	const item = cart.items.find((item) => item.product.toString() === productId);

	if (!item) {
		return next(new ErrorHandler('Item not found in cart', 404));
	}

	// Increase quantity of the item
	item.quantity++;

	// Save the cart
	await cart.save();
	// Update subtotal
	await updateCartSubtotal(cart._id);

	return res.status(200).json({
		success: true,
		message: 'Quantity increased',
	});
});

export const decreaseQuantity = TryCatch(async (req, res, next) => {
	const { _id } = req.user;

	const { productId } = req.params;

	if (!productId) {
		return next(new ErrorHandler('Product id is required', 400));
	}
	// Find the cart for the user
	const cart = await Cart.findOne({ userId: _id });

	if (!cart) {
		return next(new ErrorHandler('Cart not found', 404));
	}
	// Find the item in the cart
	const item = cart.items.find((item) => item.product.toString() === productId);

	if (!item) {
		return next(new ErrorHandler('Item not found in cart', 404));
	}

	// Decrease quantity of the item
	if (item.quantity > 1) {
		item.quantity--;
	} else {
		// Remove item if quantity becomes 0
		const index = cart.items.findIndex((item) => item.product.toString() === productId);
		cart.items.splice(index, 1);
	}
	// Save the cart
	await cart.save();
	await updateCartSubtotal(cart._id);

	return res.status(200).json({
		success: true,
		message: 'Quantity decreased',
	});
});
