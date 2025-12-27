import prisma from '../lib/prisma';
import { collectionService } from './collectionService';
import { UserBook, Book, Collection, UserBookCollection } from '@prisma/client';

// Type for UserBook with book details
type UserBookWithBook = UserBook & {
  book: Book;
};

// Type for UserBook with book and collections
type UserBookWithBookAndCollections = UserBook & {
  book: Book;
  collections: {
    collection: Collection;
  }[];
};

export const userBookService = {
  // Add a book to user's library
  async addBookToLibrary(
    userId: string, 
    bookId: string, 
    status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ'
  ): Promise<UserBook> {
    // Create the UserBook
    const userBook = await prisma.userBook.create({
      data: {
        userId,
        bookId,
        status
      }
    });

    // Get or create system collection for this status
    let collection = await collectionService.getSystemCollection(userId, status);
    
    if (!collection) {
      // If system collections don't exist yet, create them
      await collectionService.createDefaultCollections(userId);
      collection = await collectionService.getSystemCollection(userId, status);
    }

    // Add book to the appropriate system collection
    if (collection) {
      await collectionService.addBookToCollection(userBook.id, collection.id);
    }

    return userBook;
  },

  // Update book status (and move between system collections only)
  async updateBookStatus(
    userBookId: string, 
    oldStatus: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ',
    newStatus: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ'
  ): Promise<UserBook> {
    // Get the UserBook to find userId
    const userBook = await prisma.userBook.findUnique({
      where: { id: userBookId }
    });

    if (!userBook) {
      throw new Error('UserBook not found');
    }

    // Update the status
    const updatedUserBook = await prisma.userBook.update({
      where: { id: userBookId },
      data: { 
        status: newStatus,
        // Optionally update dates
        ...(newStatus === 'CURRENTLY_READING' && !userBook.dateStarted && { dateStarted: new Date() }),
        ...(newStatus === 'READ' && !userBook.dateFinished && { dateFinished: new Date() })
      }
    });

    // Get old and new SYSTEM collections only
    const oldCollection = await collectionService.getSystemCollection(userBook.userId, oldStatus);
    const newCollection = await collectionService.getSystemCollection(userBook.userId, newStatus);

    // Remove from old system collection
    if (oldCollection) {
      try {
        await collectionService.removeBookFromCollection(userBookId, oldCollection.id);
      } catch (error) {
        // Book might not be in old collection
      }
    }

    // Add to new system collection
    if (newCollection) {
      try {
        await collectionService.addBookToCollection(userBookId, newCollection.id);
      } catch (error) {
        // Book might already be in collection
      }
    }

    
    return updatedUserBook;
  },

  // Get all books for a user
  async getUserBooks(userId: string): Promise<UserBookWithBookAndCollections[]> {
    return await prisma.userBook.findMany({
      where: { userId },
      include: {
        book: true,
        collections: {
          include: {
            collection: true
          }
        }
      }
    });
  },

  // Get books by status
  async getUserBooksByStatus(
    userId: string, 
    status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ'
  ): Promise<UserBookWithBook[]> {
    return await prisma.userBook.findMany({
      where: {
        userId,
        status
      },
      include: {
        book: true
      }
    });
  },

  // Update user book (rating, notes, etc.)
  async updateUserBook(
    userBookId: string, 
    data: {
      rating?: number;
      notes?: string;
      dateStarted?: Date;
      dateFinished?: Date;
    }
  ): Promise<UserBook> {
    return await prisma.userBook.update({
      where: { id: userBookId },
      data
    });
  },

  // Remove book from library
  async removeBookFromLibrary(userBookId: string): Promise<UserBook> {
    return await prisma.userBook.delete({
      where: { id: userBookId }
    });
  },

  // ========== CUSTOM COLLECTION METHODS ==========

  // Add a book to a custom collection
  async addToCustomCollection(
    userBookId: string,
    collectionId: string
  ): Promise<UserBookCollection> {
    // Verify the collection exists and isn't a system collection
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    if (collection.isSystem) {
      throw new Error('Cannot manually add to system collections. Use status updates instead.');
    }

    // Add to the custom collection
    return await collectionService.addBookToCollection(userBookId, collectionId);
  },

  // Remove a book from a custom collection
  async removeFromCustomCollection(
    userBookId: string,
    collectionId: string
  ): Promise<UserBookCollection> {
    // Verify it's not a system collection
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    });

    if (collection?.isSystem) {
      throw new Error('Cannot manually remove from system collections. Use status updates instead.');
    }

    return await collectionService.removeBookFromCollection(userBookId, collectionId);
  },

  // Get all custom collections a book belongs to
  async getBookCustomCollections(userBookId: string): Promise<Collection[]> {
    const userBookCollections = await prisma.userBookCollection.findMany({
      where: { userBookId },
      include: {
        collection: true
      }
    });

    // Filter to only return custom collections (not system ones)
    return userBookCollections
      .map(ubc => ubc.collection)
      .filter(collection => !collection.isSystem);
  }
};