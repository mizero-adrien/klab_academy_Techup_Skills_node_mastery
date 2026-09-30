import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/categories.routes';
import authRoutes from './routes/auth.routes';
import {connectDB} from './config/db';

dotenv.config();
connectDB();

const app = express();

const port  = process.env.PORT ||1000;

app.use(express.json());


app.get('/', (req, res)=>{
    res.send('Hello World! Updated by Adrien');
});

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`);
})