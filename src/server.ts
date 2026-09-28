import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port  = process.env.PORT ||1000;

const products  = [
    { id:1, name: 'Wireless mouse', price: 15.99},
    { id:2, name: 'Mechanical keyboard', price: 49.99},
    {id:3, name: 'USB-C hub', price: 24.5},
];

app.get('/', (req, res)=>{
    res.send('Hello World! Updated by Adrien');
});

app.get('/products', (req, res)=>{
    res.json(products);
});

app.get('/products/:id', (req, res)=>{
    const id  = Number(req.params.id);
    const product  = products.find((p)=> p.id === id);

    if (!product){
        return res.status(404).json({message: 'Product not found'});
    }
    res.json(product);

}
)


app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`);
})