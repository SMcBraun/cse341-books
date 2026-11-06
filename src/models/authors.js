/* ==========================================================
 * src/models/authors.js — Author MODEL (talks to the database)
 * PLAIN ENGLISH: Functions that read author data from MongoDB.
 * LOGIC: getDb() → authors collection → query → return data.
 * WHY WE NEED IT: Keeps database code out of controllers and
 *   routes, the same pattern as src/models/books.js.
 * LEARNING GAP: The data comes from the "authors" collection I
 *   created in Atlas (cse341-books-db). If the name in
 *   db.collection('authors') is spelled differently, MongoDB
 *   returns an empty array, NOT an error.
 * ========================================================== */
import { getDb } from '../db/connect.js';

/* PLAIN ENGLISH: Get every author in the collection.
 * LOGIC: find({}) with an empty filter = all documents.
 *   toArray() turns the results into a normal array.
 * WHY WE NEED IT: Powers GET /authors.
 * LEARNING GAP: Like SQL "SELECT * FROM authors". */
const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection('authors');
    const authors = await collection.find({}).toArray();
    return authors;
};

export { getAllAuthors };