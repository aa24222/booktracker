import React, { useState } from 'react';
import { X, Search, BookOpen } from 'lucide-react';
import { searchBooks } from '../services/api';

const AddBookModal = ({ onClose, onSubmit, bookColors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [status, setStatus] = useState('want');

  // Search Google Books
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results.books || []);
      console.log('📚 Search results:', results.books?.length || 0);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search books. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  // Select a book from search results
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    console.log('📖 Selected book:', book.title);
  };

  // Add selected book to library
  const handleAddToLibrary = (e) => {
    e.preventDefault();
    
    if (!selectedBook) return;

    const bookToAdd = {
      bookId: selectedBook.id,           // Google Books ID
      title: selectedBook.title,
      author: selectedBook.author,
      isbn: selectedBook.isbn || 'unknown',
      pages: selectedBook.pageCount || 0,
      status: status,
      description: selectedBook.description || '',
      color: bookColors[Math.floor(Math.random() * bookColors.length)],
      rating: 0,
      dateRead: null,
      collections: []
    };

    onSubmit(bookToAdd);
  };

  // Reset to search
  const handleBackToSearch = () => {
    setSelectedBook(null);
    setStatus('want');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-book-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{selectedBook ? 'Add to Library' : 'Search for Books'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* SEARCH VIEW */}
        {!selectedBook && (
          <>
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label>Search Books</label>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="search-button"
                    disabled={searching || !searchQuery.trim()}
                  >
                    {searching ? (
                      'Searching...'
                    ) : (
                      <>
                        <Search size={18} />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* SEARCH RESULTS */}
            <div className="search-results">
              {searching && (
                <div className="search-loading">
                  <BookOpen size={40} />
                  <p>Searching Google Books...</p>
                </div>
              )}

              {!searching && searchResults.length === 0 && searchQuery && (
                <div className="search-empty">
                  <p>No books found. Try a different search term.</p>
                </div>
              )}

              {!searching && searchResults.length > 0 && (
                <div className="results-list">
                  {searchResults.map((book) => (
                    <div 
                      key={book.id} 
                      className="result-item"
                      onClick={() => handleSelectBook(book)}
                    >
                      {book.thumbnail && (
                        <img 
                          src={book.thumbnail} 
                          alt={book.title}
                          className="result-thumbnail"
                        />
                      )}
                      <div className="result-info">
                        <h3>{book.title}</h3>
                        <p className="result-author">{book.author}</p>
                        {book.pageCount && (
                          <p className="result-pages">{book.pageCount} pages</p>
                        )}
                        {book.publishedDate && (
                          <p className="result-date">Published: {book.publishedDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!searching && searchResults.length === 0 && !searchQuery && (
                <div className="search-prompt">
                  <BookOpen size={60} />
                  <p>Search for books by title, author, or ISBN</p>
                  <p className="search-hint">Try searching for "The Hobbit" or "Neil Gaiman"</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* CONFIRM ADD VIEW */}
        {selectedBook && (
          <div className="confirm-add">
            <div className="selected-book-preview">
              {selectedBook.thumbnail && (
                <img 
                  src={selectedBook.thumbnail} 
                  alt={selectedBook.title}
                  className="preview-cover"
                />
              )}
              <div className="preview-info">
                <h3>{selectedBook.title}</h3>
                <p className="preview-author">by {selectedBook.author}</p>
                {selectedBook.pageCount && (
                  <p className="preview-pages">{selectedBook.pageCount} pages</p>
                )}
              </div>
            </div>

            {selectedBook.description && (
              <div className="book-description-preview">
                <label>Description</label>
                <p>{selectedBook.description.substring(0, 300)}...</p>
              </div>
            )}

            <form onSubmit={handleAddToLibrary}>
              <div className="form-group">
                <label>Reading Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="want">Want to Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={handleBackToSearch}
                >
                  Back to Search
                </button>
                <button type="submit" className="submit-btn">
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .add-book-modal {
          max-width: 700px;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .search-form {
          margin-bottom: 1.5rem;
        }

        .search-input-wrapper {
          display: flex;
          gap: 0.5rem;
        }

        .search-input-wrapper input {
          flex: 1;
        }

        .search-button {
          padding: 1rem 1.5rem;
          background: var(--warm-brown);
          color: var(--cream);
          border: 2px solid var(--wood-dark);
          font-family: 'Lora', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .search-button:hover:not(:disabled) {
          background: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
        }

        .search-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .search-results {
          flex: 1;
          overflow-y: auto;
          min-height: 300px;
          max-height: 500px;
        }

        .search-loading,
        .search-empty,
        .search-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          color: var(--deep-brown);
          opacity: 0.7;
        }

        .search-loading svg,
        .search-prompt svg {
          color: var(--warm-brown);
          margin-bottom: 1rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .search-prompt p {
          font-family: 'Lora', serif;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .search-hint {
          font-size: 0.95rem !important;
          font-style: italic;
          opacity: 0.6;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .result-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(139, 69, 19, 0.05);
          border: 2px solid rgba(139, 69, 19, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .result-item:hover {
          background: rgba(139, 69, 19, 0.1);
          border-color: var(--warm-brown);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15);
        }

        .result-thumbnail {
          width: 60px;
          height: 90px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .result-info {
          flex: 1;
        }

        .result-info h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: var(--deep-brown);
          margin-bottom: 0.3rem;
          line-height: 1.3;
        }

        .result-author {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          color: var(--warm-brown);
          margin-bottom: 0.3rem;
        }

        .result-pages,
        .result-date {
          font-size: 0.85rem;
          color: var(--deep-brown);
          opacity: 0.6;
          margin-top: 0.2rem;
        }

        .confirm-add {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .selected-book-preview {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: rgba(139, 69, 19, 0.05);
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .preview-cover {
          width: 80px;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .preview-info h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: var(--deep-brown);
          margin-bottom: 0.5rem;
        }

        .preview-author {
          font-family: 'Lora', serif;
          font-size: 1rem;
          color: var(--warm-brown);
          margin-bottom: 0.5rem;
        }

        .preview-pages {
          font-size: 0.9rem;
          color: var(--deep-brown);
          opacity: 0.7;
        }

        .book-description-preview {
          margin-bottom: 1.5rem;
        }

        .book-description-preview label {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          color: var(--warm-brown);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .book-description-preview p {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--deep-brown);
          opacity: 0.8;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .back-btn {
          flex: 1;
          padding: 1rem;
          background: transparent;
          color: var(--warm-brown);
          border: 2px solid var(--warm-brown);
          font-family: 'Lora', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(139, 69, 19, 0.1);
          transform: translateY(-2px);
        }

        .submit-btn {
          flex: 2;
        }
      `}</style>
    </div>
  );
};

export default AddBookModal;