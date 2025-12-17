import { Router } from 'express';

export const bookRouter = Router();

bookRouter.get('/', (req, res) => {
    res.json({ message: 'Get all books'});
});

bookRouter.post('/', (req, res) => {
    res.json({ message: 'Post a book'});
});