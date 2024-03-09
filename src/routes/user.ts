import express from 'express';
import { getAllUsers, getUser, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();

//route - /api/v1/new
app.post('/new', newUser);

//route - /api/v1/:id
app.get('/all', adminOnly, getAllUsers);

//route - /api/v1/:id
app.route('/:id').get(getUser);

export default app;
