import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IProduct {
    _id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    image: string;
}

const ProductSchema = new Schema<IProduct>({
    _id: {
        type: String
    },
    name: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    },
    stock: {
        type: Number, required: true
    },
    description: {
        type: String, required: true
    },
    image: {
        type: String, required: true
    }
}, {
    collection: "products",
    timestamps: true,
    _id: false // Enabling custom _id
})

ProductSchema.plugin(uniqueValidator, { message: 'Product already exists' });

const Product = model<IProduct>('Product', ProductSchema);

