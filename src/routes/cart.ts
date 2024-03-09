import express from 'express';
import { addToCart, decreaseQuantity, emptyCart, getCartItems, increaseQuantity, removeFromCart } from '../controllers/cart.js';
import { isAuthenticated } from '../middlewares/auth.js';

const app = express.Router();

//Add to cart - /api/v1/cart/add
app.post('/add', isAuthenticated, addToCart);

//Get cart items - /api/v1/cart
app.get('/all', isAuthenticated, getCartItems);

//Make cart empty - /api/v1/cart/empty
app.delete('/empty', isAuthenticated, emptyCart);

//remove from cart - /api/v1/cart/:productId
app.delete('/:productId', isAuthenticated, removeFromCart);

//Increase quantity - /api/v1/cart/:productId
app.put('/increase/:productId', isAuthenticated, increaseQuantity);

//Decrease quantity - /api/v1/cart/:userId/:productId
app.put('/decrease/:productId', isAuthenticated, decreaseQuantity);

export default app;
