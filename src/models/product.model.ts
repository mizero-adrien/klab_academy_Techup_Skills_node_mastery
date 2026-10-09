import {Schema, model, Document, Types} from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: Types.ObjectId; 
    imageUrl?: string;
}

const productSchema   = new Schema<IProduct>({
    name : {type: String, required: true},
    description : {type: String, required: false},
    price : {type: Number, required: true, min: 0},
    stock : {type: Number, required: true, min: 0, default: 0},
    category : {
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true,
        index: true,
    },
    imageUrl : {type: String, required: false},
},
    {timestamps: true}
)

export const Product = model<IProduct>('Product', productSchema);