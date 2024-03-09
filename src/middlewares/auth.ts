import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.js';
import ErrorHandler from '../utils/utility-class.js';
import { TryCatch } from './error.js';
import { UserType } from '../types/types.js';

export const adminOnly = TryCatch(async (req, res, next) => {
	const { id } = req.query;
	if (!id) {
		return next(new ErrorHandler('Admin id is required', 401));
	}
	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler('User does not exists', 401));
	}
	if (user.role !== 'admin') {
		return next(new ErrorHandler('User is not admin', 403));
	}
	next();
});

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

export const isAuthenticated = TryCatch(async (req: Request, res, next: NextFunction) => {
	const { userId } = req.query;
	if (!userId) {
		return res.status(404).json({
			success: false,
			message: 'Login first',
		});
	}
	const user = User.findById(userId);
	if (!user) {
		return res.status(401).json({
			success: false,
			message: 'Not authorized',
		});
	}

	req.user = await User.findById(userId);

	next();
});
