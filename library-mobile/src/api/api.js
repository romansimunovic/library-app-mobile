import axios from 'axios';
import { API_URL } from '@env';

export const BASE_URL = `${API_URL}/books`;

const handleError = (error) => {
  console.log('[API ERROR]', error.response?.data || error.message);
  throw new Error(error.response?.data?.message || error.message);
};

// Dohvat svih knjiga
export const getBooks = async () => {
  try {
    console.log('[API] GET', BASE_URL);
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Dohvat jedne knjige po ID-u
export const getBookById = async (bookId) => {
  try {
    console.log('[API] GET', `${BASE_URL}/${bookId}`);
    const response = await axios.get(`${BASE_URL}/${bookId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Dodavanje nove knjige
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

// Ažuriranje postojeće knjige
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

// Pretraga knjiga po naslovu ili autoru
export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw new Error('Greška pri pretraživanju knjiga');
  }
};


// Brisanje knjige
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
