import React from 'react';
import BookCard from './BookCard';

const Bookshelf = ({ books, hoveredBook, setHoveredBook, onBookClick }) => {
  return (
    <div className="bookshelf">
      {books.length > 0 ? (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              hoveredBook={hoveredBook}
              setHoveredBook={setHoveredBook}
              onClick={onBookClick}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>Start building your library by adding books</p>
        </div>
      )}
    </div>
  );
};

export default Bookshelf;
