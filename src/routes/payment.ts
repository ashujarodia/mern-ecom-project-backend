import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { createPaymentIntent } from '../controllers/payment.js';

const app = express.Router();

//Create paymentIntent -/api/v1/order/new
app.post('/create', isAuthenticated, createPaymentIntent);

export default app;
