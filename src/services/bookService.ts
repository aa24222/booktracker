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