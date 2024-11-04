const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is valid (not already taken)
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // If valid, add the user to the users array
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  // Return the list of all books
  res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books.find((book) => book.isbn === isbn);

  if (book) {
    return res.json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params;
  const booksByAuthor = books.filter((book) => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const { title } = req.params;
  const booksByTitle = books.filter((book) => book.title === title);

  if (booksByTitle.length > 0) {
    return res.json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books.find((book) => book.isbn === isbn);

  if (book && book.reviews) {
    return res.json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
