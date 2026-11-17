
const express = require('express');
const axios = require('axios');

const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Task 1: Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered'
    });
});

// Task 2: Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Task 3: Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: 'Book not found'
    });
});

// Task 4: Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author)
    );

    return res.status(200).json(result);
});

// Task 5: Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(title)
    );

    return res.status(200).json(result);
});

// Task 6: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    return res.status(200).json(books[isbn].reviews);
});


// ==========================================
// TASK 11: AXIOS WITH ASYNC/AWAIT
// ==========================================

// Get all books using Axios
public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/'
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books'
        });
    }
});

// Get book by ISBN using Axios
public_users.get('/asyncisbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${encodeURIComponent(req.params.isbn)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Error retrieving book by ISBN'
        });
    }
});

// Get books by author using Axios
public_users.get('/asyncauthor/:author', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(req.params.author)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Error retrieving books by author'
        });
    }
});

// Get books by title using Axios
public_users.get('/asynctitle/:title', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(req.params.title)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Error retrieving books by title'
        });
    }
});

module.exports.general = public_users;
