import React from 'react';
import { Search, Plus } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, onAddBook, onCreateCollection }) => {
  return (
    <div className="controls">
      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search your library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button className="create-collection-btn" onClick={onCreateCollection}>
        <Plus size={20} />
        Create Collection
      </button>
      <button className="add-btn" onClick={onAddBook}>
        <Plus size={20} />
        Add Book
      </button>
    </div>
  );
};

export default SearchBar;
