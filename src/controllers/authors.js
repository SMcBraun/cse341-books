/* ==========================================================
 * src/controllers/authors.js — Author CONTROLLER (decides response)
 * PLAIN ENGLISH: Receives the request, checks it, asks the author
 *   model for data, and sends back the right status code and JSON.
 * LOGIC (order of checks, from my spec):
 *   validate body (400) → record exists (404) →
 *   still has books (409, DELETE only) → write → success.
 *   catch → log the real error on the server → safe 500 message.
 * WHY WE NEED IT: Separates "what to send back" from "how to get
 *   data" (model) and "which URL" (router).
 * LEARNING GAP: The error messages match my spec-week02.md
 *   Version 2 exactly, so the code, the GitHub issue (#9), and
 *   Swagger all say the same thing.
 * ========================================================== */
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
} from '../models/authors.js';

/* ----------------------------------------------------------
 * Validation helpers
 * PLAIN ENGLISH: Small yes/no checks for the request body.
 * LOGIC:
 *   - isNonEmptyString: must be text, and not just spaces.
 *   - isValidBirthYear: must be a whole number, and not later
 *     than this year.
 * WHY WE NEED IT: My spec says bad fields return 400 BEFORE
 *   anything is written to MongoDB.
 * LEARNING GAP: typeof "a1" is 'string', but typeof 1978 is
 *   'number'. Number.isInteger(1978.5) is false, so half years
 *   are rejected.
 * ---------------------------------------------------------- */
const isNonEmptyString = (value) => {return typeof value === 'string' && value.trim() !== ''};

const isValidBirthYear = (value) => {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(value) && value <= currentYear;
};

/* PLAIN ENGLISH: Handle GET /authors (all authors).
 * LOGIC: 200 + array of authors, or 500 + safe message.
 * WHY WE NEED IT: The "Get All Authors" route.
 * LEARNING GAP:
 *   - "return" before every response (course standard).
 *   - console.error shows the real problem in MY terminal only.
 *     The client just sees the safe message. */
const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('GET /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

/* PLAIN ENGLISH: Handle GET /authors/:id (one author).
 * LOGIC:
 *   1. Read the id from the URL: req.params.id ("a1").
 *   2. Ask the model for that author.
 *   3. No author? → 404. Found it? → 200 + the author.
 *   4. Something broke? → 500 + safe message.
 * WHY WE NEED IT: The "Get Single Author" route. This controller
 *   shows success, not-found, and error cases (video item #5).
 * LEARNING GAP: 404 is a NORMAL answer ("that author isn't
 *   here"), not a crash. 500 is only for unexpected problems. */
const getAuthorByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const author = await getAuthorById(requestedId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

/* PLAIN ENGLISH: Handle POST /authors (create a new author).
 * LOGIC:
 *   1. Read id, name, birthYear from the request body.
 *   2. Any field missing or wrong type? → 400.
 *   3. That id is already used? → 400.
 *   4. Save ONLY id, name, birthYear → 201 + the new author.
 * WHY WE NEED IT: The "Create Author" write route.
 * LEARNING GAP:
 *   - "req.body || {}" protects against a request with no body,
 *     so the code doesn't crash trying to read undefined.
 *   - We build a NEW object with only 3 fields, so any extra
 *     fields someone sends are ignored (my spec's rule).
 *   - 201 = "Created," which is more exact than 200 for POST. */
const createAuthorHandler = async (req, res) => {
  const { id, name, birthYear } = req.body || {};

  try {
    if (!isNonEmptyString(id) || !isNonEmptyString(name) || !isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: 'Missing or invalid author fields.' });
    }

    const newAuthor = { id: id.trim(), name: name.trim(), birthYear };

    const existingAuthor = await getAuthorById(newAuthor.id);
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author id already exists.' });
    }

    const createdAuthor = await createAuthor(newAuthor);
    return res.status(201).json(createdAuthor);
  } catch (error) {
    console.error('POST /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

/* PLAIN ENGLISH: Handle PUT /authors/:id (update an author).
 * LOGIC:
 *   1. The id comes from the URL only (an id in the body is
 *      ignored, per my spec).
 *   2. name or birthYear missing or wrong type? → 400.
 *   3. No author with that id? → 404.
 *   4. Update name and birthYear → 200 + the updated author.
 * WHY WE NEED IT: The "Update Author" write route.
 * LEARNING GAP: We validate (400) BEFORE checking the database
 *   (404), so bad requests never cost a database trip. */
const updateAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;
  const { name, birthYear } = req.body || {};

  try {
    if (!isNonEmptyString(name) || !isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: 'Missing or invalid author fields.' });
    }

    const existingAuthor = await getAuthorById(requestedId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const updatedAuthor = await updateAuthor(requestedId, { name: name.trim(), birthYear });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

/* PLAIN ENGLISH: Handle DELETE /authors/:id (remove an author).
 * LOGIC:
 *   1. No author with that id? → 404.
 *   2. Any book still points to this author? → 409, and nothing
 *      is deleted.
 *   3. Otherwise delete → 204 with no body.
 * WHY WE NEED IT: The "Delete Author" write route, including my
 *   spec's rule for authors who still have books.
 * LEARNING GAP:
 *   - 409 = "Conflict": the request is valid, but it clashes
 *     with the data (books still need this author).
 *   - 204 = "No Content": success with nothing to send back, so
 *     we use .send() instead of .json(). */
const deleteAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const existingAuthor = await getAuthorById(requestedId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const hasBooks = await authorHasBooks(requestedId);
    if (hasBooks) {
      return res.status(409).json({ message: 'Author cannot be deleted because they still have books.' });
    }

    await deleteAuthor(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
};
