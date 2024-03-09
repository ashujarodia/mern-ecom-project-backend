import { NextFunction, Request, Response } from 'express';
import { TryCatch } from '../middlewares/error.js';
import { NewUserRequestBody } from '../types/types.js';
import { User } from '../models/user.js';
import ErrorHandler from '../utils/utility-class.js';

export const newUser = TryCatch(async (req: Request<{}, {}, NewUserRequestBody>, res: Response, next: NextFunction) => {
	const { name, email, photo, _id } = req.body;
	let user = await User.findById(_id);

	if (user) {
		return res.status(200).json({
			success: true,
			message: `Welcome , ${user.name}`,
			role: user.role,
		});
	}

	if (!_id || !name || !email || !photo) {
		return next(new ErrorHandler('Please add all fields', 400));
	}

	user = await User.create({ name, email, photo, _id });

	return res.status(200).json({
		success: true,
		message: `Welcome , ${user.name}`,
	});
});

export const getUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	if (!id) {
		return next(new ErrorHandler('Id is required', 400));
	}
	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler('User not found', 404));
	}
	return res.status(200).json({
		success: true,
		user,
	});
});

export const getAllUsers = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
	const users = await User.find({});
	return res.status(200).json({
		success: true,
		users,
	});
});
