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
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';

const router = express.Router();

/* GET /books → return all books as JSON */
router.get('/books', getBooksHandler);

/* GET /books/:id → return one book (or 404 if not found)
 * LEARNING GAP: ":id" is a placeholder. /books/b1 sets
 *   req.params.id to "b1". */
router.get('/books/:id', getBookByIdHandler);

export default router;
