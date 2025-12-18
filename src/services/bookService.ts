import prisma from '../lib/prisma';
import { Book } from '@prisma/client';

export const bookService = {
  // Get all books
  async getAllBooks(): Promise<Book[]> {
    return await prisma.book.findMany();
  },

  // Get a single book by ID
  async getBookById(id: string): Promise<Book | null> {
    return await prisma.book.findUnique({
      where: { id }
    });
  },

  // Get books by status

  async getBookByStatus(userId: string, status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ') {
    return await prisma.userBook.findMany({
        where: {
            userId: userId,
            status: status
        },
        include: {
            book: true // Include the full book details
        }
    });
  },

  // Get all of a user's books grouped by status
  async getBooksGroupedByStatus(userId: string) {
    const wantToRead = await prisma.userBook.findMany({
        where: { userId, status: 'WANT_TO_READ'},
        include: {book: true}
    });

    const currentlyReading = await prisma.userBook.findMany({
        where: { userId, status: 'CURRENTLY_READING'},
        include: {book: true}
    });

    const read = await prisma.userBook.findMany({
        where: { userId, status: 'READ'},
        include: {book: true}
    });

    return {
      wantToRead,
      currentlyReading,
      read
    };

  },

  // Create a new book
  async createBook(data: {
    title: string;
    author: string;
    isbn?: string;
    googleBooksId?: string;
    description?: string;
    coverImageUrl?: string;
    publishedYear?: number;
    pageCount?: number;
  }): Promise<Book> {
    return await prisma.book.create({
      data
    });
  },

  // Search books by title or author
  async searchBooks(query: string): Promise<Book[]> {
    return await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
  }
};