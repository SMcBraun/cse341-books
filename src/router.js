/* ==========================================================
 * src/router.js — ROUTER (matches URLs to controllers)
 * PLAIN ENGLISH: A list of "this URL → run this function."
 * LOGIC: express.Router() makes a mini route list; app.js plugs
 *   it in with app.use(router).
 * WHY WE NEED IT: Keeps all API routes in one easy-to-read place.
 * LEARNING GAP: Pass the handler NAME without () — Express calls
 *   it later when a request arrives.
 * ========================================================== */
import express from 'express';

/* PLAIN ENGLISH: Bring in all 5 book controller functions.
 * LOGIC: They live in src/controllers/books.js.
 * WHY WE NEED IT: Each book route below calls one of them.
 * LEARNING GAP: The path starts with "./" because router.js and
 *   the controllers folder are both inside src. */
import {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from './controllers/books.js';

/* PLAIN ENGLISH: Bring in all 5 author controller functions.
 * LOGIC: They live in src/controllers/authors.js.
 * WHY WE NEED IT: Each author route below calls one of them. */
import {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
} from './controllers/authors.js';

const router = express.Router();

/* ----------------------------------------------------------
 * GET /books → return all books as JSON
 * PLAIN ENGLISH: When someone visits /books, send back every book.
 * LOGIC: Runs getBooksHandler, which returns 200 + the books,
 *   or 500 if something breaks.
 * WHY WE NEED IT: The "Get All Books" route.
 * LEARNING GAP: The @openapi comment right below describes this
 *   route for Swagger. It does NOT change how the route works.
 *   It must sit DIRECTLY above the route it describes.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books returned successfully, each with an authorId
 *       500:
 *         description: Unable to retrieve books
 */
router.get('/books', getBooksHandler);

/* ----------------------------------------------------------
 * GET /books/:id → return one book (or 404 if not found)
 * PLAIN ENGLISH: When someone visits /books/b1, send back that
 *   one book.
 * LOGIC: Runs getBookByIdHandler, which returns 200 + the book,
 *   404 if no book has that id, or 500 if something breaks.
 * WHY WE NEED IT: The "Get Single Book" route.
 * LEARNING GAP:
 *   - ":id" is a placeholder. /books/b1 sets req.params.id
 *     to "b1".
 *   - In Express the route says /books/:id, but in the @openapi
 *     comment it's written /books/{id}. Same meaning, different
 *     style, because OpenAPI uses curly braces.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to retrieve book
 */
router.get('/books/:id', getBookByIdHandler);

/* ----------------------------------------------------------
 * POST /books → create a new book
 * PLAIN ENGLISH: Send a new book's id, authorId, title, and
 *   publicationDate, and the API saves it.
 * LOGIC: Runs createBookHandler → 201, 400, or 500.
 * WHY WE NEED IT: The "Create Book" write route.
 * LEARNING GAP: authorId must match a real author (a1, a2, a3),
 *   or the API returns 400.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a book
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - authorId
 *               - title
 *               - publicationDate
 *             properties:
 *               id:
 *                 type: string
 *               authorId:
 *                 type: string
 *               title:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *                 description: Date in YYYY-MM-DD format
 *           example:
 *             id: b4
 *             authorId: a1
 *             title: Example Book Title
 *             publicationDate: '2026-01-15'
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Missing or invalid book fields, book id already exists, or author not found for the given authorId
 *       500:
 *         description: Unable to create book
 */
router.post('/books', createBookHandler);

/* ----------------------------------------------------------
 * PUT /books/:id → update an existing book
 * PLAIN ENGLISH: Send a new authorId, title, and
 *   publicationDate for a book, and the API updates it.
 * LOGIC: Runs updateBookHandler → 200, 400, 404, or 500.
 * WHY WE NEED IT: The "Update Book" write route.
 * LEARNING GAP: The id goes in the URL box, NOT in the JSON
 *   body. That's why the example body has no id.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update a book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorId
 *               - title
 *               - publicationDate
 *             properties:
 *               authorId:
 *                 type: string
 *               title:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *                 description: Date in YYYY-MM-DD format
 *           example:
 *             authorId: a2
 *             title: Updated Book Title
 *             publicationDate: '2026-02-20'
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Missing or invalid book fields, or author not found for the given authorId
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to update book
 */
router.put('/books/:id', updateBookHandler);

/* ----------------------------------------------------------
 * DELETE /books/:id → delete a book
 * PLAIN ENGLISH: Remove one book by its id.
 * LOGIC: Runs deleteBookHandler → 204, 404, or 500.
 * WHY WE NEED IT: The "Delete Book" write route.
 * LEARNING GAP: Deleting a book never deletes its author.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to delete book
 */
router.delete('/books/:id', deleteBookHandler);

/* ----------------------------------------------------------
 * GET /authors → return all authors as JSON
 * PLAIN ENGLISH: When someone visits /authors, send back every
 *   author (a1, a2, a3 from the Atlas "authors" collection).
 * LOGIC: Runs getAuthorsHandler, which returns 200 + the
 *   authors, or 500 if something breaks.
 * WHY WE NEED IT: The "Get All Authors" route.
 * LEARNING GAP: The "Authors" tag makes Swagger show a separate
 *   Authors section, apart from Books.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Unable to retrieve authors
 */
router.get('/authors', getAuthorsHandler);

/* ----------------------------------------------------------
 * GET /authors/:id → return one author (or 404 if not found)
 * PLAIN ENGLISH: When someone visits /authors/a1, send back
 *   that one author.
 * LOGIC: Runs getAuthorByIdHandler → 200, 404, or 500.
 * WHY WE NEED IT: The "Get Single Author" route.
 * LEARNING GAP: Same {id} parameter pattern as GET /books/{id}.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get one author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author id, such as a1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author returned successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to retrieve author
 */
router.get('/authors/:id', getAuthorByIdHandler);

/* ----------------------------------------------------------
 * POST /authors → create a new author
 * PLAIN ENGLISH: Send a new author's id, name, and birthYear,
 *   and the API saves it.
 * LOGIC: Runs createAuthorHandler → 201, 400, or 500.
 * WHY WE NEED IT: The "Create Author" write route.
 * LEARNING GAP: "requestBody" tells Swagger to show a JSON box
 *   with the example below. GET routes don't have one because
 *   they don't send data.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             id: a4
 *             name: Example Author
 *             birthYear: 1980
 *     responses:
 *       201:
 *         description: Author created
 *       400:
 *         description: Missing or invalid author fields, or author id already exists
 *       500:
 *         description: Unable to create author
 */
router.post('/authors', createAuthorHandler);

/* ----------------------------------------------------------
 * PUT /authors/:id → update an existing author
 * PLAIN ENGLISH: Send a new name and birthYear for an author,
 *   and the API updates it.
 * LOGIC: Runs updateAuthorHandler → 200, 400, 404, or 500.
 * WHY WE NEED IT: The "Update Author" write route.
 * LEARNING GAP: The id goes in the URL box, NOT in the JSON
 *   body. That's why the example body has no id.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author id, such as a1
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             name: Updated Author
 *             birthYear: 1981
 *     responses:
 *       200:
 *         description: Author updated
 *       400:
 *         description: Missing or invalid author fields
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to update author
 */
router.put('/authors/:id', updateAuthorHandler);

/* ----------------------------------------------------------
 * DELETE /authors/:id → delete an author
 * PLAIN ENGLISH: Remove an author, but ONLY if no books still
 *   point to them.
 * LOGIC: Runs deleteAuthorHandler → 204, 404, 409, or 500.
 * WHY WE NEED IT: The "Delete Author" write route.
 * LEARNING GAP: 409 is listed here so Swagger documents my
 *   spec's "author still has books" rule.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author id, such as a1
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted
 *       404:
 *         description: Author not found
 *       409:
 *         description: Author cannot be deleted because they still have books
 *       500:
 *         description: Unable to delete author
 */
router.delete('/authors/:id', deleteAuthorHandler);

export default router;
