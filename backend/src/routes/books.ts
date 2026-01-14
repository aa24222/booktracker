import express, { Request, Response } from 'express';
import axios from 'axios';

export const bookRouter = express.Router();

// Google Books API configuration
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// TypeScript interfaces for Google Books API response!!
interface IndustryIdentifier {
  type: string;
  identifier: string;
}

interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

interface VolumeInfo {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  pageCount?: number;
  categories?: string[];
  imageLinks?: ImageLinks;
  language?: string;
}

interface GoogleBookItem {
  id: string;
  volumeInfo: VolumeInfo;
}

interface GoogleBooksSearchResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBookItem[];
}

interface GoogleBooksSingleResponse {
  id: string;
  volumeInfo: VolumeInfo;
}

// Standardized book format
interface Book {
  id: string;
  title: string;
  author: string;
  authors: string[];
  isbn: string | null;
  publishedDate: string | null;
  pageCount: number | null;
  description: string | null;
  thumbnail: string | null;
  categories: string[];
  publisher: string | null;
  language: string | null;
}

// Search for books using Google Books API
bookRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    // Validate query parameter
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Query parameter is required' 
      });
    }

    // Call Google Books API
    const response = await axios.get<GoogleBooksSearchResponse>(GOOGLE_BOOKS_API, {
      params: {
        q: query,
        maxResults: 20,
        printType: 'books'
      }
    });

    // Transform Google Books response to our format
    const books: Book[] = response.data.items?.map((item: GoogleBookItem) => {
      const volumeInfo = item.volumeInfo;
      
      return {
        id: item.id,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors?.[0] || 'Unknown Author',
        authors: volumeInfo.authors || [],
        isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
        publishedDate: volumeInfo.publishedDate || null,
        pageCount: volumeInfo.pageCount || null,
        description: volumeInfo.description || null,
        thumbnail: volumeInfo.imageLinks?.thumbnail || null,
        categories: volumeInfo.categories || [],
        publisher: volumeInfo.publisher || null,
        language: volumeInfo.language || null
      };
    }) || [];

    res.json({ books });
  } catch (error: any) {
    console.error('Error searching books:', error);
    
    res.status(500).json({ 
      error: 'Failed to search books',
      message: error?.message || 'Unknown error'
    });
  }
});

// Get a specific book by Google Books ID
bookRouter.get('/:bookId', async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    // Call Google Books API for specific book
    const response = await axios.get<GoogleBooksSingleResponse>(
      `${GOOGLE_BOOKS_API}/${bookId}`
    );
    
    const volumeInfo = response.data.volumeInfo;
    
    const book: Book = {
      id: response.data.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors?.[0] || 'Unknown Author',
      authors: volumeInfo.authors || [],
      isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
      publishedDate: volumeInfo.publishedDate || null,
      pageCount: volumeInfo.pageCount || null,
      description: volumeInfo.description || null,
      thumbnail: volumeInfo.imageLinks?.thumbnail || null,
      categories: volumeInfo.categories || [],
      publisher: volumeInfo.publisher || null,
      language: volumeInfo.language || null
    };

    res.json(book);
  } catch (error: any) {
    console.error('Error fetching book:', error);
    
    res.status(500).json({ 
      error: 'Failed to fetch book',
      message: error?.message || 'Unknown error'
    });
  }
});