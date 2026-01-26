import { Request, Response } from 'express';
import { userBookService } from '../services/userBookService';

export const userBookController = {
  // POST /api/user-books
  async addBookToLibrary(req: Request, res: Response): Promise<void> {
    try {
      const { userId, bookId, status } = req.body;
      const userBook = await userBookService.addBookToLibrary(userId, bookId, status || 'WANT_TO_READ');
      res.status(201).json(userBook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add book to library' });
    }
  },

  // PATCH /api/user-books/:id/status
  async updateBookStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { oldStatus, newStatus } = req.body;
      
      const userBook = await userBookService.updateBookStatus(id, oldStatus, newStatus);
      res.json(userBook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update book status' });
    }
  },

  // GET /api/user-books?userId=123
  async getUserBooks(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const userBooks = await userBookService.getUserBooks(userId as string);
      res.json(userBooks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user books' });
    }
  },

  // GET /api/user-books/status/:status?userId=123
  async getUserBooksByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const { userId } = req.query;
      
      const userBooks = await userBookService.getUserBooksByStatus(
        userId as string, 
        status as 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ'
      );
      res.json(userBooks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user books' });
    }
  },

  // PATCH /api/user-books/:id
  async updateUserBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating, notes, dateStarted, dateFinished } = req.body;
      
      const userBook = await userBookService.updateUserBook(id, {
        rating,
        notes,
        dateStarted: dateStarted ? new Date(dateStarted) : undefined,
        dateFinished: dateFinished ? new Date(dateFinished) : undefined
      });
      res.json(userBook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user book' });
    }
  },

  // DELETE /api/user-books/:id
  async removeBookFromLibrary(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await userBookService.removeBookFromLibrary(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove book from library' });
    }
  },

  // ========== CUSTOM COLLECTION ENDPOINTS ==========

  // GET /api/user-books/:id/custom-collections
  async getBookCustomCollections(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // userBookId
      const collections = await userBookService.getBookCustomCollections(id);
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get custom collections' });
    }
  },

  // POST /api/user-books/:id/custom-collections
  async addToCustomCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // userBookId
      const { collectionId } = req.body;
      
      const result = await userBookService.addToCustomCollection(id, collectionId);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add to custom collection' });
      }
    }
  },

  // DELETE /api/user-books/:id/custom-collections/:collectionId
  async removeFromCustomCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id, collectionId } = req.params;
      
      const result = await userBookService.removeFromCustomCollection(id, collectionId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to remove from custom collection' });
      }
    }
  }
};