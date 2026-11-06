/* ==========================================================
 * src/controllers/authors.js — Author CONTROLLER (decides response)
 * PLAIN ENGLISH: Receives the request, asks the author model for
 *   data, and sends back the right status code and JSON.
 * LOGIC: try → get data → 200.
 *   catch → log the real error on the server → safe 500 message.
 * WHY WE NEED IT: Separates "what to send back" from "how to get
 *   data" (model) and "which URL" (router).
 * LEARNING GAP: The error messages match my spec-week02.md
 *   Version 2 exactly, so the code, the GitHub issue (#9), and
 *   Swagger all say the same thing.
 * ========================================================== */
import { getAllAuthors } from '../models/authors.js';

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

export { getAuthorsHandler };