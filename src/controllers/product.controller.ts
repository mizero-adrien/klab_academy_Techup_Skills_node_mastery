import { Request, Response} from 'express';
import { getAllProducts, getProductById } from '../services/product.service';

export const listProducts  = (req: Request, res: Response) =>{
    const products  = getAllProducts();
    res.json(products);
};

export const getProduct  = (req: Request, res: Response) =>{
    const id  = Number(req.params.id);
    const product  = getProductById(id);

    if(!product){
        return res.status(404).json({message: 'Product not found'});
    }
    res.json(product);
}