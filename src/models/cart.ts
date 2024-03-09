import mongoose from 'mongoose';

// Define schema for the items in the cart
const cartItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
	},
});

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		items: [cartItemSchema],
		subtotal: {
			type: Number,
			default: 0,
		},
		tax: {
			type: Number,
			default: 0,
		},
		shippingCharges: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
