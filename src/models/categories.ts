import mongoose from 'mongoose';

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter name'],
		},
		photo: {
			type: String,
			required: [true, 'Please add photo'],
		},
	},
	{ timestamps: true }
);

export const Category = mongoose.model('Category', schema);
