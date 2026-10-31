/* ==========================================================
 * src/router.js — ROUTER (matches URLs to controllers)
 * PLAIN ENGLISH: A list of "this URL → run this function."
 * LOGIC: express.Router() makes a mini route list; app.js plugs
 *   it in with app.use(router).
 * WHY WE NEED IT: Keeps all API routes in one easy-to-read place.
 * LEARNING GAP: Pass the handler NAME (getBooksHandler) without
 *   () — Express calls it later when a request arrives. Adding
 *   () would run it immediately, which is a common bug.
 * ========================================================== */
import express from 'express';
import { getBooksHandler } from './controllers/books.js';

const router = express.Router();

/* GET /books → return all books as JSON */
router.get('/books', getBooksHandler);

export default router;
