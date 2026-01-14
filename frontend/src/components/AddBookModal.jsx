import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddBookModal = ({ onClose, onSubmit, bookColors }) => {
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'want',
    pages: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const book = {
      ...newBook,
      color: bookColors[Math.floor(Math.random() * bookColors.length)],
      pages: parseInt(newBook.pages) || 0,
      rating: 0,
      dateRead: null,
      description: '',
      collections: []
    };
    onSubmit(book);
    setNewBook({ title: '', author: '', status: 'want', pages: '' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a New Book</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newBook.title}
              onChange={e => setNewBook({...newBook, title: e.target.value})}
              required
              placeholder="Enter book title..."
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={newBook.author}
              onChange={e => setNewBook({...newBook, author: e.target.value})}
              required
              placeholder="Enter author name..."
            />
          </div>
          <div className="form-group">
            <label>Pages</label>
            <input
              type="number"
              value={newBook.pages}
              onChange={e => setNewBook({...newBook, pages: e.target.value})}
              placeholder="Number of pages..."
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select 
              value={newBook.status}
              onChange={e => setNewBook({...newBook, status: e.target.value})}
            >
              <option value="want">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="read">Read</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
