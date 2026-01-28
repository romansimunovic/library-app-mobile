# Library Mobile App

**Mentor:** Assistant Marko Buljan
**Course:** Programming 3 – Faculty of Humanities and Social Sciences, University of Osijek, 2nd year Master’s

## Project Description

This is a **mobile application for library management**. It allows users to:

* View a list of books with availability status
* Add new books
* Edit existing books
* Delete books with confirmation
* View detailed information about a book

The app is built using **React Native** and **Expo Go**, and communicates with a **Spring Boot REST API backend**.

---

## Features

1. **Book List** – Fetches books from the backend and displays them in a `FlatList`.
2. **Add / Edit Book** – Uses the same form component for both, validates required fields (title and author).
3. **Book Details** – Displays all relevant fields from the `BookResponse` object.
4. **Delete Book** – Prompts for confirmation before deletion.
5. **Availability Display** – Shows `available` attribute.
6. **Navigation** – React Navigation (Bottom Tabs + Stack for book screens).
7. **React Hooks** – `useState` and `useEffect` for state and data fetching.
8. **HTTP Requests** – Axios using the `.env` variable `API_URL`.
9. **Basic Validation** – Book title and author cannot be empty.
10. **List Refreshing** – Updates list after adding, editing, or deleting a book.

---

## Technical Details

* **React Native + Expo Go**
* **Axios** for REST API calls
* **Environment Variable** for backend URL:

```env
API_URL=http://<YOUR_COMPUTER_IP>:8080/api
```

* Mobile device must be **on the same Wi-Fi network** as the backend server.
* Simple, modular UI components: `BookItem`, `BookFormScreen`, `BookListScreen`, `BookDetailScreen`.

---

## Project Structure

```
src/
  api/           -> Axios calls to backend (BookRequest / BookResponse)
  components/    -> BookItem component
  screens/       -> BookHomeScreen, BookListScreen, BookFormScreen, BookDetailScreen
  navigation/    -> Stack navigator for books
App.js           -> Root NavigationContainer
.env             -> API_URL
```

---

## Running the Project

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Start the Expo bundler:

```bash
expo r -c
```

4. Scan the QR code.
5. Open **Expo Go** on your mobile device (must be on the same Wi-Fi network).
6. Ensure `.env` contains the correct computer IP where the backend is running:

```env
API_URL=http://192.168.x.x:8080/api
```

7. The app can now fetch, add, edit, and delete books via the REST API.

---

## Development Issues & Solutions

* **Navigator Error:** `"A navigator can only contain Screen, Group or React.Fragment..."`
  → Solution: Each screen must be passed through the `component` prop in `Stack.Screen`.

* **Axios Timeout / Network Error:**
  → Cause: Using `localhost` or incorrect IP.
  → Solution: Use your computer’s IP (`192.168.x.x`) in `.env` and ensure the mobile device is on the same Wi-Fi network.

* **.env Variables:**
  → Expo requires `babel-plugin-dotenv-import` or `@env`.
  → All backend calls were moved to `api.js` using `API_URL`.

* **Add / Edit Book:**
  → Initially failed because `bookId` was missing in requests.
  → Now uses `BookRequest` object according to backend REST API.

* **Styling Issues:**
  → Elements were overlapping. Fixed with modular, clean styling.

---

## AI Assistance

* **ChatGPT (GPT-4/5)** was used for:

  * Refactoring and modularizing code
  * Suggesting final design and UX improvements
  * Writing the API layer (`api.js`) and `.env` configuration

* All functionality and logic were manually tested and confirmed.

---

## Backend Repository

* Backend is in a **separate repository**, using Spring Boot and PostgreSQL.
* Configuration: `.properties` file with server IP, port 8080, and database credentials.
* REST API supports:

```
GET /api/books
GET /api/books/{bookId}
POST /api/books
PUT /api/books/{bookId}
DELETE /api/books/{bookId}
```

* `BookRequest` / `BookResponse` are defined according to the task (without BaseEntity fields).

---