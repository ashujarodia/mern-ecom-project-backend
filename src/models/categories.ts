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
			required: [true, 'Please add photo'],
		},
	},
	{ timestamps: true }
);

export const Category = mongoose.model('Category', schema);
