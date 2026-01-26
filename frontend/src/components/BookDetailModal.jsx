import React, { useState } from 'react';
import { X, Clock, Check } from 'lucide-react';

const BookDetailModal = ({ book, onClose, onSave, customCollections }) => {
  const [rating, setRating] = useState(book.rating || 0);
  const [newStatus, setNewStatus] = useState(book.status);
  const [selectedCollections, setSelectedCollections] = useState(book.collections || []);

  const toggleCollection = (collectionId) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(selectedCollections.filter(id => id !== collectionId));
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  const handleSave = () => {
    onSave({
      id: book.id,
      status: newStatus,
      rating,
      collections: selectedCollections
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn detail-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="book-detail-content">
          <div className="book-detail-left">
            <div className="book-cover" style={{ background: book.color }}>
              <div className="book-cover-content">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
            </div>
            
            <div className="book-meta">
              <div className="meta-item">
                <Clock size={16} />
                <span>{book.pages} pages</span>
              </div>
              {book.dateRead && (
                <div className="meta-item">
                  <Check size={16} />
                  <span>Read on {book.dateRead}</span>
                </div>
              )}
            </div>
          </div>

          <div className="book-detail-right">
            <div className="book-detail-header">
              <h2>{book.title}</h2>
              <p className="book-detail-author">by {book.author}</p>
            </div>

            <div className="rating-section">
              <label>Your Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="description-section">
              <label>Description</label>
              <p className="book-description">
                {book.description || "A captivating journey through the pages of an unforgettable story. This book weaves together themes of love, loss, and redemption in a way that stays with you long after you've turned the final page."}
              </p>
            </div>

            <div className="status-section">
              <label>Reading Status</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-select"
              >
                <option value="want">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="read">Read</option>
              </select>
            </div>

            {customCollections.length > 0 && (
              <div className="collections-section">
                <label>Add to Collections</label>
                <div className="collections-list">
                  {customCollections.map(collection => (
                    <label key={collection.id} className="collection-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection.id)}
                        onChange={() => toggleCollection(collection.id)}
                      />
                      <span className="checkbox-custom"></span>
                      <div className="collection-info">
                        <span className="collection-name">{collection.name}</span>
                        <span className="collection-desc">{collection.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
