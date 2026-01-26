import React from 'react';
import { BookOpen, Heart, Check } from 'lucide-react';

const BookCard = ({ book, hoveredBook, setHoveredBook, onClick }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'reading': return <BookOpen size={14} />;
      case 'want': return <Heart size={14} />;
      case 'read': return <Check size={14} />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'reading': return 'Currently Reading';
      case 'want': return 'Want to Read';
      case 'read': return 'Read';
      default: return '';
    }
  };

  return (
    <div 
      className="book"
      onMouseEnter={() => setHoveredBook(book.id)}
      onMouseLeave={() => setHoveredBook(null)}
      onClick={() => onClick(book)}
    >
      <div className="book-spine" style={{ background: book.color }}>
        <div className="book-content">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
          <div className="book-status">
            {getStatusIcon(book.status)}
            <span>{getStatusLabel(book.status)}</span>
          </div>
        </div>
      </div>
      {hoveredBook === book.id && (
        <div className="book-tooltip">
          {book.pages} pages
        </div>
      )}
    </div>
  );
};

export default BookCard;
