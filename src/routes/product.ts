import express from 'express';
import { deleteProduct, getAllProducts, getFeaturedProducts, getLatestProducts, getPopularProducts, getProductDetails, getSimilarProducts, newProduct, updateProduct } from '../controllers/product.js';
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';

const app = express.Router();

//Create new product -api/v1/product/new
app.post('/new', adminOnly, singleUpload, newProduct);

//Get all products -api/v1/product/all
app.get('/all', getAllProducts);

//Get latest 5 products -api/v1/product/latest
app.get('/latest', getLatestProducts);

//Get featured products -api/v1/product/featured
app.get('/featured', getFeaturedProducts);

//Get popular products (Average rating is greater than 3 star) -api/v1/product/popular
app.get('/popular', getPopularProducts);

//Get similar products -api/v1/product/similar/:id
app.get('/similar/:id', getSimilarProducts);

//Get, Update , delete  product -api/v1/product/:id
app.route('/:id').get(getProductDetails).put(adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct);

export default app;
