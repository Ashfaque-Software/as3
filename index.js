// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory data for books (replace this with a database)
let books = [
  { id: 1, title: 'Book 1', author: 'Author 1', ISBN: '1234567890' },
  { id: 2, title: 'Book 2', author: 'Author 2', ISBN: '0987654321' },
];

// Welcome message endpoint
app.get('/', (req, res) => {
  res.send('WELCOME TO BOOKSTORE MANAGEMENT SYSTEM');
});

// Books endpoint - Display all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Middleware to validate book details before adding
const validator = (req, res, next) => {
  const { title, author, ISBN } = req.body;
  if (!title || !author || !ISBN) {
    res.status(400).json({ error: 'Invalid book details. Please provide title, author, and ISBN.' });
  } else {
    next();
  }
};

// Add a new book endpoint
app.post('/books/add', validator, (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    ISBN: req.body.ISBN,
  };

  books.push(newBook);
  res.status(201).json({ message: 'Book added successfully!', book: newBook });
});

// Search for books endpoint
app.get('/books/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const result = books.filter(
    (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
  );
  res.json(result);
});

// Update a book endpoint
app.patch('/books/update/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    res.json({ message: `Book with ID ${bookId} updated successfully!`, book: books[index] });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Delete a book endpoint
app.delete('/books/delete/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const deletedBook = books.find((book) => book.id === bookId);

  books = books.filter((book) => book.id !== bookId);

  if (deletedBook) {
    res.json({ message: `Book with ID ${bookId} deleted successfully!`, book: deletedBook });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Handle invalid endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Invalid endpoint. Please check your request.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
