import { Request, Response } from 'express';
import mongoose from 'mongoose';

const Product = mongoose.model('Product');

const getAllProducts = async (req: Request, res: Response) => {
    let limit = isNaN(parseInt(`${req.query.limit}`)) ? null : parseInt(`${req.query.limit}`);

    try {
        let products;

        if (limit) products = await Product.find().limit(limit);
        else products = await Product.find();

        res.send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product) {
            res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };