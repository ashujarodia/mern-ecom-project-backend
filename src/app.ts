import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import Stripe from 'stripe';
import { errroMiddleware } from './middlewares/error.js';
import { connectDB } from './utils/database.js';

//importing routes
import cartRoutes from './routes/cart.js';
import categoryRoutes from './routes/category.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';

const app = express();

config({
	path: './.env',
});

const mongoURI = process.env.MONGO_URI || '';
const port = process.env.PORT || 4000;
const stripeKey = process.env.STRIPE_KEY || '';

connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
	res.send('Api working with /api/v1');
});

//using routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);

//using middlewares
app.use('./uploads', express.static('uploads'));
app.use(errroMiddleware);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port, () => {
	console.log(`Server is working on port : ${port}`);
});
