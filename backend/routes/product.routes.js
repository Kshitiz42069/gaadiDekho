import express from 'express';
import { allProduct, createProduct, deleteProduct, productDetail, updateProduct } from '../controller/product.controller.js';
import protectRoute from '../middleware/ProtectRoute.js'

const router = express.Router();

router.post('/',protectRoute,createProduct);

router.get('/',allProduct);

router.get('/:id',productDetail);

router.put('/:id',protectRoute,updateProduct);

router.delete('/:id',protectRoute,deleteProduct);

export default router;