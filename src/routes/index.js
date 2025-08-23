import express from 'express';
import { YourController } from '../controllers/index.js';

const router = express.Router();

// Define your routes here
router.get('/your-endpoint', YourController.getMethod);
router.post('/your-endpoint', YourController.postMethod);
// Add more routes as needed

export default router;