import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import {connectDB} from './config/db';

dotenv.config();
connectDB();

const app = express();
const port  = process.env.PORT ||1000;


app.get('/', (req, res)=>{
    res.send('Hello World! Updated by Adrien');
});

app.use('/products', productRoutes);

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`);
})