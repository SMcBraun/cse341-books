/* ==========================================================
 * src/controllers/books.js — Book CONTROLLER (decides response)
 * PLAIN ENGLISH: Receives the request, asks the model for data,
 *   and sends back the right status code and JSON.
 * LOGIC: try → get books → 200 + books. catch → log the real
 *   error on the server → 500 + safe message to the client.
 * WHY WE NEED IT: Separates "what to send back" from "how to
 *   get data" (model) and "which URL" (router).
 * LEARNING GAP: The client only sees "Internal server error",
 *   never the technical details (course standard: don't expose
 *   full errors). The details go to console.error for you.
 * ========================================================== */
import { getAllBooks } from '../models/books.js';

/* PLAIN ENGLISH: Handle GET /books.
 * LOGIC: res.status(200) = OK, .json(books) = send the array.
 * LEARNING GAP: "return" in front of every response is a course
 *   standard (ESLint checks it). 200 = success, 500 = server
 *   problem (not the user's fault). */
const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler };
