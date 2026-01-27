import axios from 'axios';
import { API_URL } from '@env';

export const BASE_URL = `${API_URL}/books`;

/**
 * Handles API errors uniformly.
 * Logs error details and throws an Error with a message suitable for the user.
 */
const handleError = (error) => {
  console.log('[API ERROR]', error.response?.data || error.message);
  throw new Error(error.response?.data?.message || error.message);
};

/**
 * Fetch all books from the backend.
 * @returns {Promise<Array>} List of books
 */
export const getBooks = async () => {
  try {
    console.log('[API] GET', BASE_URL);
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Fetch a single book by its ID.
 * @param {string} bookId - Book identifier
 * @returns {Promise<Object>} Book data
 */
export const getBookById = async (bookId) => {
  try {
    console.log('[API] GET', `${BASE_URL}/${bookId}`);
    const response = await axios.get(`${BASE_URL}/${bookId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Create a new book entry.
 * @param {Object} bookRequest - Book data to create
 * @returns {Promise<Object>} Created book
 */
export const createBook = async (bookRequest) => {
  try {
    console.log('[API] POST', BASE_URL, bookRequest);
    const response = await axios.post(BASE_URL, bookRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('[API] POST response', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Update an existing book.
 * @param {string} bookId - Book identifier
 * @param {Object} bookRequest - Updated book data
 * @returns {Promise<Object>} Updated book
 */
export const updateBook = async (bookId, bookRequest) => {
  try {
    console.log('[API] PUT', `${BASE_URL}/${bookId}`, bookRequest);
    const response = await axios.put(`${BASE_URL}/${bookId}`, bookRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('[API] PUT response', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Search books by title or author.
 * @param {string} query - Search keyword
 * @returns {Promise<Array>} Matching books
 */
export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw new Error('Error searching for books');
  }
};

/**
 * Delete a book by ID.
 * @param {string} bookId - Book identifier
 * @returns {Promise<Object>} Deletion result
 */
export const deleteBook = async (bookId) => {
  try {
    console.log('[API] DELETE', `${BASE_URL}/${bookId}`);
    const response = await axios.delete(`${BASE_URL}/${bookId}`);
    console.log('[API] DELETE response', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
