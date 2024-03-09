import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { addNewCategory, deleteCategory, getAllCategories, getCategoryDetails, updateCategory } from '../controllers/category.js';

const app = express.Router();

//Create new category -api/v1/category/new
app.post('/new', adminOnly, singleUpload, addNewCategory);

//Get all categories -api/v1/category/all
app.get('/all', getAllCategories);

//Update and delete category -api/v1/category/:id
app.route('/:id').get(adminOnly, getCategoryDetails).put(adminOnly, singleUpload, updateCategory).delete(adminOnly, deleteCategory);

export default app;
