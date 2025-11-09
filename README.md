# BookTracker

A Django REST API for managing your book collection. Users can add books manually, import from a Goodreads CSV, or search and retrieve books from the Google Books API.  

## Features

- **Add books manually**: Type in the books you're currently reading and add them to your shelf.
- **Import from CSV**: Upload a Goodreads export CSV to bulk add books.
- **Search Google Books**: Look up books via Google Books API and get book information (title, author, cover).

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **CSV Handling**: pandas
- **API Requests**: requests

## Future Plans

- Convert book cover images into **pixel art**.
- Develop a **full-stack frontend** using React for an nteractive bookshelf experience.
