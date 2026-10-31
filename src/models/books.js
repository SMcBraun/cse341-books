/* ==========================================================
 * src/models/books.js — Book MODEL (talks to the database)
 * PLAIN ENGLISH: Functions that read book data from MongoDB.
 * LOGIC: getDb() → books collection → query → return data.
 * WHY WE NEED IT: Keeps database code out of controllers and
 *   routes (course standard: keep handlers small).
 * LEARNING GAP: find() = MANY documents (needs toArray()).
 *   findOne() = ONE document (returns the object, or null if
 *   nothing matches).
 * ========================================================== */
import { getDb } from '../db/connect.js';

/* PLAIN ENGLISH: Get every book in the collection.
 * LOGIC: find({}) with an empty filter = all documents.
 * LEARNING GAP: Like SQL "SELECT * FROM books". */
const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

/* PLAIN ENGLISH: Get ONE book whose id matches (for example "b1").
 * LOGIC: findOne({ id: bookId }) searches our custom "id" field.
 * WHY WE NEED IT: Powers GET /books/:id.
 * LEARNING GAP:
 *   - We search "id" (our simple "b1"), NOT "_id" (MongoDB's
 *     ObjectId). The course uses "id" this week for easy testing.
 *   - If nothing matches, findOne returns null. The controller
 *     turns null into a 404.
 *   - Like SQL "SELECT * FROM books WHERE id = 'b1' LIMIT 1". */
const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

export { getAllBooks, getBookById };
