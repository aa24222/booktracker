# BookShelf

A lightweight book tracking application built with Node.js, TypeScript, and PostgreSQL. Think of it as a simpler, more personal alternative to Goodreads - track your reading journey with a clean interface and optional Goodreads data import.

## Features

* **Manual book entry**: Add books you're reading to your personal collection
* **Reading status tracking**: Mark books as "Want to Read", "Currently Reading", or "Read"
* **Google Books integration**: Search and retrieve book information (title, author, cover, description)
* **Goodreads import**: Migrate your existing Goodreads library via CSV export
* **Personal notes & ratings**: Add your own thoughts and rate books 1-5 stars

## Tech Stack

### Backend
* **Runtime**: Node.js with TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **CSV Processing**: Python with pandas (for Goodreads imports)
* **API Integration**: Axios (Google Books API)

### Development Tools
* **Type Safety**: TypeScript
* **Dev Server**: Nodemon with ts-node
* **Database UI**: Prisma Studio

## Project Structure
```
booktracker/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic & database operations
│   ├── lib/            # Prisma client & utilities
│   └── index.ts        # Express app entry point
├── prisma/
│   └── schema.prisma   # Database schema
└── scripts/
    └── process_goodreads.py  # CSV import processor
```

## Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL
* Docker (for Prisma Dev)
* Python 3.x (for CSV processing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/booktracker.git
cd booktracker
```

2. Install dependencies
```bash
npm install
pip install -r scripts/requirements.txt
```

3. Set up the database
```bash
npx prisma dev  # Sets up local PostgreSQL with Docker
```

4. Run migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Books
* `GET /api/books` - Get all books
* `GET /api/books/:id` - Get a specific book
* `POST /api/books` - Create a new book
* `GET /api/books/search?q=query` - Search Google Books API

### User Books (Your Library)
* `GET /api/user-books` - Get your book collection
* `POST /api/user-books` - Add a book to your library
* `PATCH /api/user-books/:id` - Update status/rating/notes
* `DELETE /api/user-books/:id` - Remove from library

### Import
* `POST /api/import/goodreads` - Upload Goodreads CSV export

## Database Schema

* **User** - User account information
* **Book** - Book metadata (title, author, ISBN, cover, etc.)
* **UserBook** - Junction table linking users to books with personal data (status, rating, notes, dates)

## Future Plans

* **Pixel art book covers**: Convert cover images into cozy pixel art style
* **React frontend**: Interactive bookshelf interface with drag-and-drop
* **Reading statistics**: Track reading goals, streaks, and insights
* **Tags & collections**: Organize books with custom tags
* **Mobile app**: Native mobile experience


## License

MIT
