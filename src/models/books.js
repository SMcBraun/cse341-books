/* ==========================================================
 * src/models/books.js — Book MODEL (talks to the database)
 * PLAIN ENGLISH: Functions that read and write book data in
 *   MongoDB, plus one check on the authors collection.
 * LOGIC: getDb() → collection → query → return data.
 * WHY WE NEED IT: Keeps database code out of controllers and
 *   routes (course standard: keep handlers small).
 * LEARNING GAP: find() = MANY documents (needs toArray()).
 *   findOne() = ONE document (returns the object, or null if
 *   nothing matches).
 * ========================================================== */
import { getDb } from '../db/connect.js';

/* PLAIN ENGLISH: Get every book in the collection.
 * LOGIC: find({}) with an empty filter = all documents.
 * WHY WE NEED IT: Powers GET /books.
 * LEARNING GAP: Like SQL "SELECT * FROM books". */
const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

/* PLAIN ENGLISH: Get ONE book whose id matches (for example "b1").
 * LOGIC: findOne({ id: bookId }) searches our custom "id" field.
 * WHY WE NEED IT: Powers GET /books/:id, and lets the controller
 *   check if a book exists before POST, PUT, or DELETE.
 * LEARNING GAP:
 *   - We search "id" (our simple "b1"), NOT "_id" (MongoDB's
 *     ObjectId).
 *   - If nothing matches, findOne returns null. The controller
 *     turns null into a 404. */
const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

/* PLAIN ENGLISH: Save a brand-new book.
 * LOGIC: insertOne(book) adds one document to the collection.
 * WHY WE NEED IT: Powers POST /books.
 * LEARNING GAP: MongoDB adds its own _id during insertOne, so the
 *   returned book includes _id too. */
const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(book);
  return book;
};

/* PLAIN ENGLISH: Change an existing book's authorId, title, and
 *   publicationDate.
 * LOGIC: updateOne({ id }, { $set: changes }) changes ONLY the
 *   listed fields and leaves the rest alone.
 * WHY WE NEED IT: Powers PUT /books/:id.
 * LEARNING GAP: We return { id, ...changes } so the response
 *   includes the id, as my spec says. */
const updateBook = async (bookId, bookChanges) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.updateOne({ id: bookId }, { $set: bookChanges });
  return { id: bookId, ...bookChanges };
};

/* PLAIN ENGLISH: Remove one book.
 * LOGIC: deleteOne({ id: bookId }) removes the first match.
 * WHY WE NEED IT: Powers DELETE /books/:id.
 * LEARNING GAP: Deleting a book never deletes its author. The
 *   author just has one fewer book. */
const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id: bookId });
  return result;
};

/* PLAIN ENGLISH: Is there a real author with this id?
 * LOGIC: Count documents in the AUTHORS collection where
 *   id = authorId. More than 0 = true.
 * WHY WE NEED IT: My spec says POST and PUT return 400 if the
 *   authorId doesn't match an existing author.
 * LEARNING GAP: This one function reads the authors collection,
 *   not books, because that's where the real author ids live
 *   (books.authorId → authors.id). */
const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const count = await collection.countDocuments({ id: authorId });
  return count > 0;
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
};
