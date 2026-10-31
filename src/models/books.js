/* ==========================================================
 * src/models/books.js — Book MODEL (talks to the database)
 * PLAIN ENGLISH: Functions that read book data from MongoDB.
 * LOGIC: getDb() → books collection → find({}) → toArray().
 * WHY WE NEED IT: Keeps database code out of controllers and
 *   routes (course standard: keep handlers small).
 * LEARNING GAP: find({}) returns a "cursor" (a pointer to the
 *   results), not an array. toArray() gathers the results into
 *   a normal JavaScript array. Like SQL "SELECT * FROM books".
 * ========================================================== */
import { getDb } from '../db/connect.js';

/* PLAIN ENGLISH: Get every book in the collection.
 * LOGIC: async + await waits for MongoDB to answer.
 * LEARNING GAP: '../db/connect.js' = go UP one folder (out of
 *   models) and into db. The .js ending is required. */
const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

export { getAllBooks };
