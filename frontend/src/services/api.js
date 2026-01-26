
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function for handling API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ============================================================================
// BOOKS - Google Books Search
// ============================================================================

export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/books/search?query=${encodeURIComponent(query)}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// ============================================================================
// USER BOOKS - Library Management
// ============================================================================

export const getUserBooks = async (userId, status = null) => {
  try {
    const url = status 
      ? `${API_BASE}/userbooks/user/${userId}?status=${status}`
      : `${API_BASE}/userbooks/user/${userId}`;
    
    const response = await fetch(url);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user books:', error);
    throw error;
  }
};

export const addBookToLibrary = async (userId, book, status = 'WANT_TO_READ') => {
  try {
    const response = await fetch(`${API_BASE}/userbooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        book,      // ← Send the whole book object
        status
      })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding book to library:', error);
    throw error;
  }
};

export const updateBookStatus = async (userBookId, oldStatus, newStatus) => {
  try {
    const response = await fetch(`${API_BASE}/userbooks/${userBookId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldStatus,
        newStatus
      })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating book status:', error);
    throw error;
  }
};

export const updateBookDetails = async (userBookId, updates) => {
  try {
    const response = await fetch(`${API_BASE}/userbooks/${userBookId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating book details:', error);
    throw error;
  }
};

export const deleteBookFromLibrary = async (userBookId) => {
  try {
    const response = await fetch(`${API_BASE}/userbooks/${userBookId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// ============================================================================
// COLLECTIONS - Custom Collections Management
// ============================================================================

export const getUserCollections = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/collections/user/${userId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

export const createCollection = async (userId, name, description = '') => {
  try {
    const response = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        name,
        description
      })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

export const updateCollection = async (collectionId, updates) => {
  try {
    const response = await fetch(`${API_BASE}/collections/${collectionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

export const deleteCollection = async (collectionId) => {
  try {
    const response = await fetch(`${API_BASE}/collections/${collectionId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};

// ============================================================================
// USER BOOK COLLECTIONS - Many-to-Many Relationship
// ============================================================================

export const addBookToCollection = async (userBookId, collectionId) => {
  try {
    const response = await fetch(`${API_BASE}/userbooks/${userBookId}/collections/${collectionId}`, {
      method: 'POST'
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding book to collection:', error);
    throw error;
  }
};

export const removeBookFromCollection = async (userBookId, collectionId) => {
  try {
    const response = await fetch(`${API_BASE}/userbooks/${userBookId}/collections/${collectionId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error removing book from collection:', error);
    throw error;
  }
};

export const getBookCollections = async (userBookId) => {
  try {
    const response = await fetch(`${API_BASE}/userbooks/${userBookId}/collections`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching book collections:', error);
    throw error;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Convert frontend status to backend enum
export const convertStatusToEnum = (status) => {
  const statusMap = {
    'want': 'WANT_TO_READ',
    'reading': 'CURRENTLY_READING',
    'read': 'READ'
  };
  return statusMap[status] || status;
};

// Convert backend enum to frontend status
export const convertEnumToStatus = (enumStatus) => {
  const statusMap = {
    'WANT_TO_READ': 'want',
    'CURRENTLY_READING': 'reading',
    'READ': 'read'
  };
  return statusMap[enumStatus] || enumStatus.toLowerCase();
};

// Export all as a single api object (alternative usage)
export const api = {
  // Books
  searchBooks,
  
  // User Books
  getUserBooks,
  addBookToLibrary,
  updateBookStatus,
  updateBookDetails,
  deleteBookFromLibrary,
  
  // Collections
  getUserCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  
  // User Book Collections
  addBookToCollection,
  removeBookFromCollection,
  getBookCollections,
  
  // Utils
  convertStatusToEnum,
  convertEnumToStatus
};

export default api;
