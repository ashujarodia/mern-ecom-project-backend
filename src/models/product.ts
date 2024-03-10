import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
	public_id: {
		type: String,
		required: [true, 'Public id is required'],
	},
	url: {
		type: String,
		required: [true, 'Url is required'],
	},
});

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter name'],
		},
		photo: {
			type: photoSchema,
			required: [true, 'Photo is required'],
		},
		price: {
			type: Number,
			required: [true, 'Please enter price'],
		},
		stock: {
			type: Number,
			required: [true, 'Please enter stock'],
		},
		category: {
			type: String,
			required: [true, 'Please enter category'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Please enter description'],
		},
		featured: {
			type: Boolean,
			default: false,
		},
		rating: {
			type: Number,
		},
	},
	{ timestamps: true }
);

export const Product = mongoose.model('Product', schema);
