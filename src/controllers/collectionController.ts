import { Request, Response } from 'express';
import { collectionService } from '../services/collectionService';

export const collectionController = {
  // POST /api/collections
  async createCollection(req: Request, res: Response): Promise<void> {
    try {
      const { userId, name, description } = req.body;
      const collection = await collectionService.createCollection(userId, name, description);
      res.status(201).json(collection);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create collection' });
    }
  },

  // GET /api/collections?userId=123
  async getUserCollections(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const collections = await collectionService.getUserCollections(userId as string);
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collections' });
    }
  },

  // GET /api/collections/:id
  async getCollectionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const collection = await collectionService.getCollectionById(id);
      
      if (!collection) {
        res.status(404).json({ error: 'Collection not found' });
        return;
      }
      
      res.json(collection);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collection' });
    }
  },

  // POST /api/collections/:id/books
  async addBookToCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userBookId } = req.body;
      
      const result = await collectionService.addBookToCollection(userBookId, id);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add book to collection' });
    }
  },

  // DELETE /api/collections/:id/books/:userBookId
  async removeBookFromCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id, userBookId } = req.params;
      await collectionService.removeBookFromCollection(userBookId, id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove book from collection' });
    }
  },

  // DELETE /api/collections/:id
  async deleteCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await collectionService.deleteCollection(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete collection' });
    }
  },

  // PATCH /api/collections/:id
  async updateCollection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const collection = await collectionService.updateCollection(id, name, description);
      res.json(collection);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update collection' });
    }
  }
};