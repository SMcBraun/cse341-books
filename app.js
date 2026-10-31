/* ==========================================================
 * app.js — The Express application
 * PLAIN ENGLISH: Builds the app: JSON middleware, the root
 *   health-check route, and the API routes from src/router.js.
 * LOGIC: Create app → express.json() → GET / → app.use(router)
 *   → export (server.js starts it).
 * WHY WE NEED IT: One central place that assembles the app.
 * LEARNING GAP: getDb is NOT imported here. Only models talk to
 *   the database. The practice /trails route was removed.
 * ========================================================== */
import express from 'express';
import router from './src/router.js';

const app = express();

/* PLAIN ENGLISH: Read JSON sent in request bodies (req.body). */
app.use(express.json());

/* PLAIN ENGLISH: Health check, so "/" confirms the server is up.
 * LEARNING GAP: "return" before the response (course standard). */
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

/* PLAIN ENGLISH: Plug in all API routes (like GET /books).
 * LEARNING GAP: router has no () here. We hand Express the
 *   router itself, the same idea as passing handler names. */
app.use(router);

export default app;
