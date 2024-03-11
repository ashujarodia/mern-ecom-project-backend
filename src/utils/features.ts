import { Types } from 'mongoose';
import { Cart } from '../models/cart.js';
import { Product } from '../models/product.js';
import { OrderItemType } from '../types/types.js';
import ErrorHandler from './utility-class.js';

export const reduceStock = async (orderItems: OrderItemType[]) => {
	try {
		for (let i = 0; i < orderItems.length; i++) {
			const order = orderItems[i];
			const product = await Product.findById(order.product);
			if (!product) {
				throw new ErrorHandler('Product not found', 404);
			}
			// Ensure product stock is sufficient
			if (product.stock < order.quantity) {
				throw new ErrorHandler('Insufficient stock for product', 400);
			}
			product.stock -= order.quantity;
			await product.save();
		}
	} catch (error) {
		throw error;
	}
};

export const updateCartSubtotal = async (cartId: Types.ObjectId) => {
	const cart = await Cart.findById(cartId);
	if (!cart) {
		throw new Error('Cart not found');
	}
	// Update subtotal
	cart.subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

	// Calculate tax (assuming a fixed tax rate)
	const taxPercent = 18;
	cart.tax = Math.round((taxPercent / 100) * cart.subtotal);

	// Set shipping charges (if applicable)
	const shippingCharges = 40;
	cart.shippingCharges = shippingCharges;

	// Calculate total
	cart.total = cart.subtotal + cart.tax + cart.shippingCharges;
	await cart.save();
};
