import axios from 'axios';
import { API_URL } from '@env';

const BASE_URL = `${API_URL}/books`;

// Dohvat svih knjiga
export const getBooks = async () => {
  try {
    const response = await axios.get(BASE_URL);
    // Backend vraća BookResponse
    return response.data;
  } catch (error) {
    throw new Error('Greška pri dohvaćanju knjiga');
  }
};

// Dohvat jedne knjige po ID-u
export const getBookById = async (bookId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${bookId}`);
    return response.data;
  } catch (error) {
    throw new Error('Greška pri dohvaćanju knjige');
  }
};

// Dodavanje nove knjige (BookRequest)
export const createBook = async (bookRequest) => {
  try {
    const response = await axios.post(BASE_URL, bookRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error('Greška pri dodavanju knjige');
  }
};

// Uređivanje postojeće knjige (BookRequest)
export const updateBook = async (bookId, bookRequest) => {
  try {
    const response = await axios.put(`${BASE_URL}/${bookId}`, bookRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error('Greška pri uređivanju knjige');
  }
};

// Brisanje knjige
export const deleteBook = async (bookId) => {
  try {
    await axios.delete(`${BASE_URL}/${bookId}`);
  } catch (error) {
    throw new Error('Greška pri brisanju knjige');
  }
};
