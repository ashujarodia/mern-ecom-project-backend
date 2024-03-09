import express from 'express';
import { adminOnly, isAuthenticated } from '../middlewares/auth.js';
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, processOrder } from '../controllers/order.js';

const app = express.Router();

//Create new order -/api/v1/order/new
app.post('/new', isAuthenticated, newOrder);

//Get my orders -/api/v1/order/my
app.get('/my', isAuthenticated, myOrders);

//Get all orders -/api/v1/order/all
app.get('/all', adminOnly, allOrders);

//Get order details , process order and delete order -/api/v1/order/all
app.route('/:orderId').get(getOrderDetails).put(adminOnly, processOrder).delete(adminOnly, deleteOrder);

export default app;
