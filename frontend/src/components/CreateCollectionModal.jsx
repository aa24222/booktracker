import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateCollectionModal = ({ onClose, onSubmit }) => {
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newCollection);
    setNewCollection({ name: '', description: '' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Collection</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Collection Name</label>
            <input
              type="text"
              value={newCollection.name}
              onChange={e => setNewCollection({...newCollection, name: e.target.value})}
              required
              placeholder="e.g., Summer Reading, Book Club Picks..."
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newCollection.description}
              onChange={e => setNewCollection({...newCollection, description: e.target.value})}
              placeholder="What makes this collection special?"
              rows="3"
            />
          </div>
          <button type="submit" className="submit-btn">Create Collection</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;
