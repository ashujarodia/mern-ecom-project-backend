import mongoose from 'mongoose';

const schema = new mongoose.Schema(
	{
		shippingInfo: {
			address: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			state: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
			pincode: {
				type: Number,
				required: true,
			},
		},
		user: {
			type: String,
			ref: 'User',
			required: true,
		},
		subtotal: {
			type: Number,
			required: true,
		},
		tax: {
			type: Number,
			required: true,
		},
		shippingCharges: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ['Processing', 'Shipped', 'Delivered'],
			default: 'Processing',
		},
		orderItems: [
			{
				product: {
					type: mongoose.Types.ObjectId,
					ref: 'Product',
				},
				quantity: Number,
			},
		],
	},
	{ timestamps: true }
);

export const Order = mongoose.model('Order', schema);
