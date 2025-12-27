import prisma from '../lib/prisma';
import { Collection, UserBookCollection, Book, UserBook } from '@prisma/client';

// Type for Collection with nested book data
type CollectionWithBooks = Collection & {
  books: (UserBookCollection & {
    userBook: UserBook & {
      book: Book;
    };
  })[];
};

export const collectionService = {
  // Create a new collection
  async createCollection(
    userId: string, 
    name: string, 
    description?: string
  ): Promise<Collection> {
    return await prisma.collection.create({
      data: {
        userId,
        name,
        description
      }
    });
  },

  // Get all collections for a user
  async getUserCollections(userId: string): Promise<CollectionWithBooks[]> {
    return await prisma.collection.findMany({
      where: { userId },
      include: {
        books: {
          include: {
            userBook: {
              include: {
                book: true
              }
            }
          }
        }
      }
    });
  },

  // Get a specific collection with its books
  async getCollectionById(collectionId: string): Promise<CollectionWithBooks | null> {
    return await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        books: {
          include: {
            userBook: {
              include: {
                book: true
              }
            }
          }
        }
      }
    });
  },

  // Add a book to a collection
  async addBookToCollection(
    userBookId: string, 
    collectionId: string
  ): Promise<UserBookCollection> {
    return await prisma.userBookCollection.create({
      data: {
        userBookId,
        collectionId
      }
    });
  },

  // Remove a book from a collection
  async removeBookFromCollection(
    userBookId: string, 
    collectionId: string
  ): Promise<UserBookCollection> {
    return await prisma.userBookCollection.delete({
      where: {
        userBookId_collectionId: {
          userBookId,
          collectionId
        }
      }
    });
  },

  // Delete a collection
  async deleteCollection(collectionId: string): Promise<Collection> {
    return await prisma.collection.delete({
      where: { id: collectionId }
    });
  },

  // Update collection details
  async updateCollection(
    collectionId: string, 
    name?: string, 
    description?: string
  ): Promise<Collection> {
    return await prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      }
    });
  },

  // Create default system collections for a new user
  async createDefaultCollections(userId: string): Promise<Collection[]> {
    const defaultCollections = [
      { name: 'Want to Read', description: 'Books you want to read' },
      { name: 'Currently Reading', description: 'Books you are reading now' },
      { name: 'Read', description: 'Books you have finished' }
    ];

    const collections = await Promise.all(
      defaultCollections.map(col =>
        prisma.collection.create({
          data: {
            userId,
            name: col.name,
            description: col.description,
            isSystem: true
          }
        })
      )
    );

    return collections;
  },

  // Get system collection by status
  async getSystemCollection(
    userId: string, 
    status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ'
  ): Promise<Collection | null> {
    const collectionNames = {
      WANT_TO_READ: 'Want to Read',
      CURRENTLY_READING: 'Currently Reading',
      READ: 'Read'
    };

    return await prisma.collection.findUnique({
      where: {
        userId_name: {
          userId,
          name: collectionNames[status]
        }
      }
    });
  }
};