import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import type { NextFunction, Request, Response } from 'express';
import { swaggerSpec } from './docs/swagger';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/categories.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import { connectDB } from './config/db';
import { getFrontendUrl } from './config/app';
import { apiLimiter } from './middleware/rateLimit.middleware';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 1000;
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');

// Render runs the app behind one proxy. Without this, every visitor looks like the
// same IP address and the rate limits would apply to everybody at once.
app.set('trust proxy', isProduction ? 1 : false);

// Only our own frontend may call the API from a browser
const allowedOrigins = new Set<string>([getFrontendUrl()]);
if (!isProduction) {
    allowedOrigins.add('http://localhost:5173');
}

app.use(cors({ origin: [...allowedOrigins] }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
    res.send('Hello World! Updated by Adrien');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiLimiter);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Unknown API paths answer in JSON like everything else, not with an HTML page
app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller' : err.message;
        return res.status(400).json({ message });
    }
    if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ message: err.message });
    }
    if (err instanceof SyntaxError && (err as { status?: number }).status === 400) {
        return res.status(400).json({ message: 'The request body is not valid JSON' });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`API docs available at http://localhost:${port}/api-docs`);
});
