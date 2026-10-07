import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/categories.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import {connectDB} from './config/db';

dotenv.config();
connectDB();

const app = express();

const port  = process.env.PORT ||1000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('Hello World! Updated by Adrien');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders',orderRoutes);
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`);
    console.log(`API docs available at http://localhost:${port}/api-docs`);
})