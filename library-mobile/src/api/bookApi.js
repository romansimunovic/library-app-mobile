import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const getBooks = async () => {
  const res = await api.get('/books');
  return res.data;
};

export const getBookById = async (bookId) => {
  const res = await api.get(`/books/${bookId}`);
  return res.data;
};

export const createBook = async (data) => {
  const res = await api.post('/books', data);
  return res.data;
};

export const updateBook = async (bookId, data) => {
  const res = await api.put(`/books/${bookId}`, data);
  return res.data;
};

export const deleteBook = async (bookId) => {
  await api.delete(`/books/${bookId}`);
};
