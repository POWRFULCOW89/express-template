import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products';
import auth from './auth';

const productsRouter = Router();

productsRouter.get('/:id', auth.optional, getProductById);
productsRouter.get('/', auth.optional, getAllProducts);
productsRouter.post('/', auth.required, createProduct);
productsRouter.put('/:id', auth.required, updateProduct);
productsRouter.delete('/:id', auth.required, deleteProduct);

export default productsRouter;