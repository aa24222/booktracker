import { Request, Response } from 'express';
import { bookService } from '../services/bookService';

export const bookController = {
  // GET /api/books
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },

  // GET /api/books/:id
  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  },

  // POST /api/books
  async createBook(req: Request, res: Response) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create book' });
    }
  }
};