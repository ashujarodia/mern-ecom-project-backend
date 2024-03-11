import { Request } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { NewOrderRequestBody } from '../types/types.js';
import ErrorHandler from '../utils/utility-class.js';
import { Order } from '../models/order.js';
import { reduceStock } from '../utils/features.js';

export const newOrder = TryCatch(async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
	const { shippingInfo, orderItems, subtotal, tax, shippingCharges, total } = req.body;
	const { _id } = req.user;

	if (!shippingInfo || !orderItems || !subtotal || !tax || !shippingCharges || !total) {
		return next(new ErrorHandler('Please fill all the fields', 400));
	}

	const order = await Order.create({
		shippingInfo,
		orderItems,
		user: _id,
		subtotal,
		tax,
		shippingCharges,
		total,
	});

	await reduceStock(orderItems);

	return res.status(201).json({
		success: true,
		message: 'Order placed successfully',
	});
});

export const myOrders = TryCatch(async (req, res, next) => {
	const { _id } = req.user;
	const orders = await Order.find({ user: _id }).populate('orderItems.product');

	return res.status(201).json({
		success: true,
		orders,
	});
});

export const allOrders = TryCatch(async (req, res, next) => {
	const orders = await Order.find().populate('user', 'name');
	return res.status(201).json({
		success: true,
		orders,
	});
});

export const getOrderDetails = TryCatch(async (req, res, next) => {
	const { orderId } = req.params;
	const order = await Order.findById(orderId).populate('user').populate({
		path: 'orderItems.product',
		model: 'Product',
	});
	if (!order) {
		return next(new ErrorHandler('Order not found', 404));
	}
	return res.status(201).json({
		success: true,
		order,
	});
});

export const processOrder = TryCatch(async (req, res, next) => {
	const { orderId } = req.params;
	const order = await Order.findById(orderId);
	if (!order) {
		return next(new ErrorHandler('Order not found', 404));
	}

	switch (order.status) {
		case 'Processing':
			order.status = 'Shipped';
			break;
		case 'Shipped':
			order.status = 'Delivered';
			break;

		default:
			order.status = 'Delivered';
			break;
	}

	await order.save();

	return res.status(201).json({
		success: true,
		message: `Order ${order.status} successfully`,
	});
});

export const deleteOrder = TryCatch(async (req, res, next) => {
	const { orderId } = req.params;
	const order = await Order.findById(orderId);
	if (!order) {
		return next(new ErrorHandler('Order not found', 404));
	}

	await order.deleteOne();

	return res.status(201).json({
		success: true,
		message: `Order deleted successfully`,
	});
});
