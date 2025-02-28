import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, searchRides, updateProduct } from "../controllers/rides.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";



const router = express.Router();

router.get('/', getProducts)
router.get('/search', searchRides);
router.post('/create', protectRoute, createProduct)
router.put('/update/:id',  updateProduct)
router.delete('/delete/:id',   deleteProduct)
router.get('/:id',  getProductById)

export default router; 