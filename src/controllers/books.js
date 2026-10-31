/* ==========================================================
 * src/controllers/books.js — Book CONTROLLER (decides response)
 * PLAIN ENGLISH: Receives the request, asks the model for data,
 *   and sends back the right status code and JSON.
 * LOGIC: try → get data → 200 (or 404 if not found).
 *   catch → log the real error on the server → safe 500 message.
 * WHY WE NEED IT: Separates "what to send back" from "how to
 *   get data" (model) and "which URL" (router).
 * LEARNING GAP: The client never sees technical error details
 *   (course standard). Details go to console.error for you.
 * ========================================================== */
import { getAllBooks, getBookById } from '../models/books.js';

/* PLAIN ENGLISH: Handle GET /books (all books).
 * LOGIC: 200 + array of books, or 500 + safe message.
 * LEARNING GAP: "return" before every response (course standard). */
const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/* PLAIN ENGLISH: Handle GET /books/:id (one book).
 * LOGIC:
 *   1. Read the id from the URL: req.params.id ("b1").
 *   2. Ask the model for that book.
 *   3. No book? → 404 "Book not found".
 *   4. Found it? → 200 + the book.
 *   5. Something broke? → 500 + safe message.
 * WHY WE NEED IT: This is the "Get Single Book" controller the
 *   video must explain, including its status codes.
 * LEARNING GAP:
 *   - ":id" in the route becomes req.params.id in the code.
 *   - 404 (not found) is a NORMAL answer, not a crash. 500 is
 *     only for unexpected server problems.
 *   - "requestedId" is a clear, descriptive name (course
 *     standard), better than "x" or "data". */
const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler, getBookByIdHandler };
