import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { bookRouter } from './routes/books';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Booktracker API is running' });
});

// API Routes
app.use('/api/books', bookRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
