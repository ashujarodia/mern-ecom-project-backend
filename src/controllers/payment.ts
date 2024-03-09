import { stripe } from '../app.js';
import { TryCatch } from '../middlewares/error.js';
import ErrorHandler from '../utils/utility-class.js';

export const createPaymentIntent = TryCatch(async (req, res, next) => {
	const { amount, description, name, address } = req.body;
	if (!amount || !description || !name || !address) {
		return next(new ErrorHandler('Please enter amount', 400));
	}

	const paymentIntent = await stripe.paymentIntents.create({
		currency: 'INR',
		description,
		shipping: {
			name,
			address,
		},
		amount,
	});
	return res.status(201).json({
		success: true,
		clientSecret: paymentIntent.client_secret,
	});
});
