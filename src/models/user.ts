import mongoose from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
	_id: string;
	name: string;
	email: string;
	photo: string;
	role: 'admin' | 'user';
	createdAt: Date;
	updatedAt: Date;
}

const schema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: [true, 'Please enter id'],
		},
		name: {
			type: String,
			required: [true, 'Please enter name'],
		},
		email: {
			type: String,
			unique: [true, 'Email already exists'],
			required: [true, 'Please enter email'],
			validate: validator.default.isEmail,
		},
		photo: {
			type: String,
			required: [true, 'Please add photo'],
		},
		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user',
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>('User', schema);
