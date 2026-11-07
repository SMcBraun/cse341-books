/* ==========================================================
 * src/controllers/books.js — Book CONTROLLER (decides response)
 * PLAIN ENGLISH: Receives the request, checks it, asks the book
 *   model for data, and sends back the right status code and JSON.
 * LOGIC (order of checks, from my spec):
 *   validate body (400) → book exists (404) →
 *   author exists (400) → write → success.
 *   catch → log the real error on the server → safe 500 message.
 * WHY WE NEED IT: Separates "what to send back" from "how to get
 *   data" (model) and "which URL" (router).
 * LEARNING GAP: The client never sees technical error details
 *   (course standard). Details go to console.error for me. The
 *   messages match my spec-week02.md Version 2 and issue #8.
 * ========================================================== */
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
} from '../models/books.js';

/* ----------------------------------------------------------
 * Validation helpers
 * PLAIN ENGLISH: Small yes/no checks for the request body.
 * LOGIC:
 *   - isNonEmptyString: must be text, and not just spaces.
 *   - isValidDate: must be text shaped like YYYY-MM-DD.
 * WHY WE NEED IT: My spec says bad fields return 400 BEFORE
 *   anything is written to MongoDB.
 * LEARNING GAP: /^\d{4}-\d{2}-\d{2}$/ is a "pattern" that means
 *   4 digits, dash, 2 digits, dash, 2 digits, and nothing else.
 *   So "2026-01-15" passes, but "Jan 15" fails.
 * ---------------------------------------------------------- */
const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

const isValidDate = (value) => {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
};

/* PLAIN ENGLISH: Handle GET /books (all books).
 * LOGIC: 200 + array of books, or 500 + safe message.
 * WHY WE NEED IT: The "Get All Books" route.
 * LEARNING GAP: "return" before every response (course standard). */
const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
};

/* PLAIN ENGLISH: Handle GET /books/:id (one book).
 * LOGIC:
 *   1. Read the id from the URL: req.params.id ("b1").
 *   2. Ask the model for that book.
 *   3. No book? → 404. Found it? → 200 + the book.
 *   4. Something broke? → 500 + safe message.
 * WHY WE NEED IT: The "Get Single Book" route.
 * LEARNING GAP: 404 (not found) is a NORMAL answer, not a crash.
 *   500 is only for unexpected server problems. */
const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve book.' });
  }
};

/* PLAIN ENGLISH: Handle POST /books (create a new book).
 * LOGIC:
 *   1. Read id, authorId, title, publicationDate from the body.
 *   2. Any field missing or wrong shape? → 400.
 *   3. That book id is already used? → 400.
 *   4. The authorId isn't a real author? → 400.
 *   5. Save ONLY the 4 fields → 201 + the new book.
 * WHY WE NEED IT: The "Create Book" write route.
 * LEARNING GAP: A wrong authorId is a 400 (bad request), not a
 *   404, because the URL /books exists. It's the DATA sent in
 *   the body that points to a missing author. */
const createBookHandler = async (req, res) => {
  const { id, authorId, title, publicationDate } = req.body || {};

  try {
    if (
      !isNonEmptyString(id) ||
      !isNonEmptyString(authorId) ||
      !isNonEmptyString(title) ||
      !isValidDate(publicationDate)
    ) {
      return res.status(400).json({ message: 'Missing or invalid book fields.' });
    }

    const newBook = {
      id: id.trim(),
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate,
    };

    const existingBook = await getBookById(newBook.id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    const hasAuthor = await authorExists(newBook.authorId);
    if (!hasAuthor) {
      return res.status(400).json({ message: 'Author not found for the given authorId.' });
    }

    const createdBook = await createBook(newBook);
    return res.status(201).json(createdBook);
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Unable to create book.' });
  }
};

/* PLAIN ENGLISH: Handle PUT /books/:id (update a book).
 * LOGIC:
 *   1. The id comes from the URL only (an id in the body is
 *      ignored, per my spec).
 *   2. authorId, title, or publicationDate missing or wrong
 *      shape? → 400.
 *   3. No book with that id? → 404.
 *   4. The authorId isn't a real author? → 400.
 *   5. Update → 200 + the updated book.
 * WHY WE NEED IT: The "Update Book" write route.
 * LEARNING GAP: This is how a book can move to a different
 *   author: send a new authorId, and the API checks it's real. */
const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  const { authorId, title, publicationDate } = req.body || {};

  try {
    if (!isNonEmptyString(authorId) || !isNonEmptyString(title) || !isValidDate(publicationDate)) {
      return res.status(400).json({ message: 'Missing or invalid book fields.' });
    }

    const existingBook = await getBookById(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const hasAuthor = await authorExists(authorId.trim());
    if (!hasAuthor) {
      return res.status(400).json({ message: 'Author not found for the given authorId.' });
    }

    const updatedBook = await updateBook(requestedId, {
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate,
    });
    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update book.' });
  }
};

/* PLAIN ENGLISH: Handle DELETE /books/:id (remove a book).
 * LOGIC:
 *   1. No book with that id? → 404.
 *   2. Otherwise delete → 204 with no body.
 * WHY WE NEED IT: The "Delete Book" write route.
 * LEARNING GAP: 204 = "No Content": success with nothing to send
 *   back, so we use .send() instead of .json(). */
const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const existingBook = await getBookById(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    await deleteBook(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete book.' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
