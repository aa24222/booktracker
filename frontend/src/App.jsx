import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Fireplace from './components/Fireplace';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookshelfTabs from './components/BookshelfTabs';
import Bookshelf from './components/Bookshelf';
import AddBookModal from './components/AddBookModal';
import CreateCollectionModal from './components/CreateCollectionModal';
import BookDetailModal from './components/BookDetailModal';
import {
  getUserBooks,
  getUserCollections,
  addBookToLibrary,
  updateBookStatus,
  updateBookDetails,
  createCollection,
  addBookToCollection,
  removeBookFromCollection,
  convertStatusToEnum,
  convertEnumToStatus
} from './services/api';

const App = () => {
  // State
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hoveredBook, setHoveredBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [customCollections, setCustomCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from environment
  const userId = import.meta.env.VITE_USER_ID;

  // Book colors for spines
  const bookColors = [
    "#8B4513", "#2F4F4F", "#8B0000", "#DAA520", 
    "#4B0082", "#006400", "#8B008B", "#B8860B"
  ];

  // Helper: Generate random book color
  const generateBookColor = () => {
    return bookColors[Math.floor(Math.random() * bookColors.length)];
  };

  // Helper: Format backend UserBook to frontend book format
  const formatUserBook = (userBook) => {
    return {
      id: userBook.id,                                    // UserBook ID
      userBookId: userBook.id,                            // Keep for API calls
      bookId: userBook.bookId,                            // Original Google Books ID
      title: userBook.book.title,
      author: userBook.book.author,
      status: convertEnumToStatus(userBook.status),       // Convert to frontend format
      color: generateBookColor(),                          // Generate random color
      pages: userBook.book.pageCount || 0,
      rating: userBook.rating || 0,
      dateRead: userBook.dateFinished,
      description: userBook.book.description || '',
      collections: userBook.collections?.map(c => c.collectionId) || []
    };
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!userId) {
      setError('User ID not configured. Please set VITE_USER_ID in your .env file.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load books and collections in parallel
      const [userBooksData, collectionsData] = await Promise.all([
        getUserBooks(userId),
        getUserCollections(userId)
      ]);

      // Format books for frontend
      const formattedBooks = userBooksData.map(formatUserBook);
      setBooks(formattedBooks);

      // Filter out system collections (only show custom collections in tabs)
      const customOnly = collectionsData.filter(c => !c.isSystem);
      setCustomCollections(customOnly);

      console.log('✅ Data loaded:', {
        books: formattedBooks.length,
        collections: customOnly.length
      });
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(`Failed to load your library: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search and active tab
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = false;
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab.startsWith('collection-')) {
      const collectionId = parseInt(activeTab.replace('collection-', ''));
      matchesTab = book.collections && book.collections.includes(collectionId);
    } else {
      matchesTab = book.status === activeTab;
    }
    
    return matchesSearch && matchesTab;
  });

  // Handler: Add a new book to library
  const handleAddBook = async (newBook) => {
    try {
      const enumStatus = convertStatusToEnum(newBook.status);
      
      // Format book object for backend
      const bookData = {
        id: newBook.bookId,              // Google Books ID
        title: newBook.title,
        author: newBook.author,
        isbn: newBook.isbn || 'unknown', // Backend requires ISBN
        pageCount: newBook.pages,
        description: newBook.description,
        publishedDate: newBook.publishedDate,
        thumbnail: newBook.thumbnail
      };
      
      // Call API to add book
      const userBook = await addBookToLibrary(userId, bookData, enumStatus);
      // ...
      // Format and add to state
      const formatted = formatUserBook(userBook);
      setBooks([...books, formatted]);
      setShowAddModal(false);

      console.log('✅ Book added:', formatted.title);
    } catch (err) {
      console.error('Failed to add book:', err);
      alert(`Failed to add book: ${err.message}`);
    }
  };

  // Handler: Create a new collection
  const handleCreateCollection = async (newCollection) => {
    try {
      const collection = await createCollection(
        userId,
        newCollection.name,
        newCollection.description || ''
      );
      
      setCustomCollections([...customCollections, collection]);
      setShowCollectionModal(false);

      console.log('✅ Collection created:', collection.name);
    } catch (err) {
      console.error('Failed to create collection:', err);
      alert(`Failed to create collection: ${err.message}`);
    }
  };

  // Handler: Save book details (status, rating, collections)
  const handleSaveBook = async (updatedData) => {
    const originalBook = books.find(b => b.id === updatedData.id);
    
    if (!originalBook) {
      console.error('Book not found');
      return;
    }

    try {
      // 1. Update status if changed
      if (updatedData.status !== originalBook.status) {
        const oldEnum = convertStatusToEnum(originalBook.status);
        const newEnum = convertStatusToEnum(updatedData.status);
        
        await updateBookStatus(updatedData.id, oldEnum, newEnum);
        console.log('✅ Status updated:', updatedData.status);
      }

      // 2. Update rating/notes if changed
      if (updatedData.rating !== originalBook.rating) {
        await updateBookDetails(updatedData.id, { 
          rating: updatedData.rating 
        });
        console.log('✅ Rating updated:', updatedData.rating);
      }

      // 3. Update custom collection memberships
      const originalCollections = originalBook.collections || [];
      const newCollections = updatedData.collections || [];

      // Find collections to add
      const toAdd = newCollections.filter(id => !originalCollections.includes(id));
      // Find collections to remove
      const toRemove = originalCollections.filter(id => !newCollections.includes(id));

      // Add to new collections
      for (const collectionId of toAdd) {
        await addBookToCollection(updatedData.id, collectionId);
        console.log('✅ Added to collection:', collectionId);
      }

      // Remove from collections
      for (const collectionId of toRemove) {
        await removeBookFromCollection(updatedData.id, collectionId);
        console.log('✅ Removed from collection:', collectionId);
      }

      // Update local state
      const updatedBooks = books.map(book => 
        book.id === updatedData.id 
          ? { ...book, ...updatedData } 
          : book
      );
      setBooks(updatedBooks);

      console.log('✅ Book saved successfully');
    } catch (err) {
      console.error('Failed to save book:', err);
      alert(`Failed to save changes: ${err.message}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          fontFamily: 'Lora, serif',
          fontSize: '1.5rem',
          color: '#4A2511'
        }}>
          Loading your library...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app">
        <Navbar />
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          fontFamily: 'Lora, serif',
          color: '#4A2511'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>⚠️ Error</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>{error}</p>
          <button 
            onClick={loadData}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <Fireplace />
      <Header />
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddBook={() => setShowAddModal(true)}
        onCreateCollection={() => setShowCollectionModal(true)}
      />

      <BookshelfTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customCollections={customCollections}
      />

      <Bookshelf 
        books={filteredBooks}
        hoveredBook={hoveredBook}
        setHoveredBook={setHoveredBook}
        onBookClick={setSelectedBook}
      />

      {showAddModal && (
        <AddBookModal 
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddBook}
          bookColors={bookColors}
        />
      )}

      {showCollectionModal && (
        <CreateCollectionModal 
          onClose={() => setShowCollectionModal(false)}
          onSubmit={handleCreateCollection}
        />
      )}

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSave={handleSaveBook}
          customCollections={customCollections}
        />
      )}
    </div>
  );
};

export default App;
