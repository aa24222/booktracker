import React from 'react';

const BookshelfTabs = ({ activeTab, setActiveTab, customCollections }) => {
  return (
    <div className="tabs">
      <button 
        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
        onClick={() => setActiveTab('all')}
      >
        All Books
      </button>
      <button 
        className={`tab ${activeTab === 'reading' ? 'active' : ''}`}
        onClick={() => setActiveTab('reading')}
      >
        Currently Reading
      </button>
      <button 
        className={`tab ${activeTab === 'want' ? 'active' : ''}`}
        onClick={() => setActiveTab('want')}
      >
        Want to Read
      </button>
      <button 
        className={`tab ${activeTab === 'read' ? 'active' : ''}`}
        onClick={() => setActiveTab('read')}
      >
        Read
      </button>
      {customCollections.map(collection => (
        <button
          key={collection.id}
          className={`tab ${activeTab === `collection-${collection.id}` ? 'active' : ''}`}
          onClick={() => setActiveTab(`collection-${collection.id}`)}
        >
          {collection.name}
        </button>
      ))}
    </div>
  );
};

export default BookshelfTabs;
