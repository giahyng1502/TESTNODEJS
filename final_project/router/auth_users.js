const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid (e.g., not already taken)
const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

// Function to authenticate a user based on username and password
const authenticatedUser = (username, password) => {
  // Assuming users are stored with a hashed password in production.
  const user = users.find((user) => user.username === username);
  return user && user.password === password; // Match username and password
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the user is registered and the password is correct
  if (authenticatedUser(username, password)) {
    // Create a token with the username as payload
    const token = jwt.sign({ username }, "mytoken", { expiresIn: "1h" });
    return res.json({ token }); // Send back the token to the user
  }

  return res.status(403).json({ message: "Invalid login credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, "mytoken", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // If token is valid, find the user
    const username = decoded.username;
    // Assuming you have a structure to store reviews, add the review
    // Example: Assuming books is an array of objects, each with an isbn and reviews property
    const book = books.find((book) => book.isbn === isbn);
    if (book) {
      book.reviews.push({ username, review });
      return res.json({ message: "Review added successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
