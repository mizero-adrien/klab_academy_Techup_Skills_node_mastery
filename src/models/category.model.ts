import {Schema, model, Document} from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description?: string;
    imageUrl?: string;
    productCount?: number;
}

const categorySchema  = new Schema<ICategory>({
    name : {type: String, required: true, unique: true},
    description : {type: String, required: false},
    imageUrl : {type: String, required: false},
},

    {timestamps: true }

);

export const Category  = model<ICategory>('Category', categorySchema);