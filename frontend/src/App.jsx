import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Fireplace from './components/Fireplace';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookshelfTabs from './components/BookshelfTabs';
import Bookshelf from './components/Bookshelf';
import AddBookModal from './components/AddBookModal';
import CreateCollectionModal from './components/CreateCollectionModal';
import BookDetailModal from './components/BookDetailModal';

const App = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      status: "read",
      color: "#8B4513",
      pages: 304,
      rating: 5,
      dateRead: "Dec 15, 2024",
      description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. A story about all the choices that go into a life well lived.",
      collections: [1]
    },
    {
      id: 2,
      title: "Piranesi",
      author: "Susanna Clarke",
      status: "reading",
      color: "#2F4F4F",
      pages: 272,
      rating: 0,
      dateRead: null,
      description: "Piranesi's house is no ordinary building: its rooms are infinite, its corridors endless, its walls are lined with thousands upon thousands of statues, each one different from all the others. A mesmerizing tale of mystery and enchantment.",
      collections: [1, 2]
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      status: "want",
      color: "#8B0000",
      pages: 496,
      rating: 0,
      dateRead: null,
      description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the author of The Martian. Packed with clever science and a gripping story that will keep you turning pages.",
      collections: []
    },
    {
      id: 4,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      status: "read",
      color: "#DAA520",
      pages: 352,
      rating: 4,
      dateRead: "Nov 3, 2024",
      description: "A tale of gods, kings, immortal fame and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer's enduring masterwork, The Iliad. An action-packed adventure, an epic love story.",
      collections: [1]
    },
    {
      id: 5,
      title: "Circe",
      author: "Madeline Miller",
      status: "want",
      color: "#4B0082",
      pages: 400,
      rating: 0,
      dateRead: null,
      description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—not powerful, like her father, nor viciously alluring like her mother. Turning to the world of mortals for companionship, she discovers that she does possess power—the power of witchcraft.",
      collections: []
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hoveredBook, setHoveredBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [customCollections, setCustomCollections] = useState([
    { id: 1, name: "Fantasy Favorites", description: "My all-time favorite fantasy novels" },
    { id: 2, name: "Cozy Reads", description: "Perfect for rainy afternoons with tea" }
  ]);

  const bookColors = [
    "#8B4513", "#2F4F4F", "#8B0000", "#DAA520", 
    "#4B0082", "#006400", "#8B008B", "#B8860B"
  ];

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

  // Handler for adding a new book
  const handleAddBook = (newBook) => {
    const book = {
      id: books.length + 1,
      ...newBook
    };
    setBooks([...books, book]);
    setShowAddModal(false);
  };

  // Handler for creating a new collection
  const handleCreateCollection = (newCollection) => {
    const collection = {
      id: customCollections.length + 100,
      ...newCollection
    };
    setCustomCollections([...customCollections, collection]);
    setShowCollectionModal(false);
  };

  // Handler for updating book details
  const handleSaveBook = (updatedData) => {
    const updatedBooks = books.map(book => 
      book.id === updatedData.id 
        ? { ...book, status: updatedData.status, rating: updatedData.rating, collections: updatedData.collections } 
        : book
    );
    setBooks(updatedBooks);
  };

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
