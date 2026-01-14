import express, { Request, Response } from 'express';
import { userBookService } from '../services/userBookService';
import { collectionController } from '../controllers/collectionController';

export const userBookRouter = express.Router();


// Add a book to user's library
userBookRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, book, status } = req.body;

    // Validate required fields
    if (!userId || !book || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, book, status' 
      });
    }

    // Validate mandatory book fields
    if (!book.id || !book.title || !book.author || !book.isbn) {
      return res.status(400).json({
        error: 'Book must have: id, title, author, isbn'
      });
    }

    // Validate status
    const validStatuses = ['WANT_TO_READ', 'CURRENTLY_READING', 'READ'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: WANT_TO_READ, CURRENTLY_READING, READ' 
      });
    }

    const userBook = await userBookService.addBookToLibrary(userId, book, status);
    
    res.status(201).json(userBook);
  } catch (error: any) {
    console.error('Error adding book to library:', error);
    res.status(500).json({ 
      error: 'Failed to add book to library',
      message: error?.message || 'Unknown error'
    });
  }
});
// Get all books for a user (with optional status filter)
userBookRouter.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let books;
    
    if (status && typeof status === 'string') {
      // Validate status if provided
      const validStatuses = ['WANT_TO_READ', 'CURRENTLY_READING', 'READ'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status filter. Must be one of: WANT_TO_READ, CURRENTLY_READING, READ' 
        });
      }
      books = await userBookService.getUserBooksByStatus(
        userId, 
        status as 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ'
      );
    } else {
      books = await userBookService.getUserBooks(userId);
    }

    res.json(books);
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user books',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update book status (moves between system collections)
userBookRouter.patch('/:userBookId/status', async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;
    const { oldStatus, newStatus } = req.body;

    // Validate required fields
    if (!oldStatus || !newStatus) {
      return res.status(400).json({ 
        error: 'Missing required fields: oldStatus, newStatus' 
      });
    }

    // Validate statuses
    const validStatuses = ['WANT_TO_READ', 'CURRENTLY_READING', 'READ'];
    if (!validStatuses.includes(oldStatus) || !validStatuses.includes(newStatus)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: WANT_TO_READ, CURRENTLY_READING, READ' 
      });
    }

    const updatedBook = await userBookService.updateBookStatus(
      userBookId,
      oldStatus,
      newStatus
    );

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({ 
      error: 'Failed to update book status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update book metadata (rating, notes, dates)
userBookRouter.patch('/:userBookId', async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;
    const { rating, notes, dateStarted, dateFinished } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
    if (dateStarted !== undefined) updateData.dateStarted = new Date(dateStarted);
    if (dateFinished !== undefined) updateData.dateFinished = new Date(dateFinished);

    const updatedBook = await userBookService.updateUserBook(userBookId, updateData);

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book metadata:', error);
    res.status(500).json({ 
      error: 'Failed to update book metadata',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete a book from user's library
userBookRouter.delete('/:userBookId', async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;

    const deletedBook = await userBookService.removeBookFromLibrary(userBookId);

    res.json({ 
      message: 'Book removed from library',
      book: deletedBook 
    });
  } catch (error) {
    console.error('Error removing book from library:', error);
    res.status(500).json({ 
      error: 'Failed to remove book from library',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ========== CUSTOM COLLECTION ROUTES ==========

// Add book to a custom collection
userBookRouter.post('/:userBookId/collections/:collectionId', async (req: Request, res: Response) => {
  try {
    const { userBookId, collectionId } = req.params;

    const result = await userBookService.addToCustomCollection(userBookId, collectionId);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding book to collection:', error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('system collection')) {
        return res.status(403).json({ 
          error: error.message 
        });
      }
      if (error.message.includes('not found')) {
        return res.status(404).json({ 
          error: error.message 
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to add book to collection',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Remove book from a custom collection
userBookRouter.delete('/:userBookId/collections/:collectionId', async (req: Request, res: Response) => {
  try {
    const { userBookId, collectionId } = req.params;

    const result = await userBookService.removeFromCustomCollection(userBookId, collectionId);

    res.json({ 
      message: 'Book removed from collection',
      result 
    });
  } catch (error) {
    console.error('Error removing book from collection:', error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('system collection')) {
        return res.status(403).json({ 
          error: error.message 
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to remove book from collection',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all custom collections a book belongs to
userBookRouter.get('/:userBookId/collections', async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;

    const collections = await userBookService.getBookCustomCollections(userBookId);

    res.json(collections);
  } catch (error) {
    console.error('Error fetching book collections:', error);
    res.status(500).json({ 
      error: 'Failed to fetch book collections',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});