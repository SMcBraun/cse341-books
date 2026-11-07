/* ==========================================================
 * src/models/authors.js — Author MODEL (talks to the database)
 * PLAIN ENGLISH: Functions that read and write author data in
 *   MongoDB, plus one check on the books collection.
 * LOGIC: getDb() → collection → query → return data.
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

/* PLAIN ENGLISH: Get ONE author whose id matches (like "a1").
 * LOGIC: findOne({ id: authorId }) searches our custom "id".
 * WHY WE NEED IT: Powers GET /authors/:id, and lets the
 *   controller check if an author exists before POST, PUT, or
 *   DELETE.
 * LEARNING GAP: Returns null if nothing matches. The controller
 *   turns null into a 404 (or allows a new POST). */
const getAuthorById = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId });
  return author;
};

/* PLAIN ENGLISH: Save a brand-new author.
 * LOGIC: insertOne(author) adds one document to the collection.
 * WHY WE NEED IT: Powers POST /authors.
 * LEARNING GAP: MongoDB adds its own _id to the object during
 *   insertOne, so the returned author includes _id too. */
const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.insertOne(author);
  return author;
};

/* PLAIN ENGLISH: Change an existing author's name and birthYear.
 * LOGIC: updateOne({ id }, { $set: changes }) changes ONLY the
 *   fields listed in "changes" and leaves the rest alone.
 * WHY WE NEED IT: Powers PUT /authors/:id.
 * LEARNING GAP: $set means "set these fields." Without it,
 *   MongoDB rejects the update. We return { id, ...changes } so
 *   the response includes the id, as my spec says. */
const updateAuthor = async (authorId, authorChanges) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.updateOne({ id: authorId }, { $set: authorChanges });
  return { id: authorId, ...authorChanges };
};

/* PLAIN ENGLISH: Remove one author.
 * LOGIC: deleteOne({ id: authorId }) removes the first match.
 * WHY WE NEED IT: Powers DELETE /authors/:id.
 * LEARNING GAP: The controller checks for books BEFORE calling
 *   this, so an author with books is never deleted. */
const deleteAuthor = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id: authorId });
  return result;
};

/* PLAIN ENGLISH: Does any book still point to this author?
 * LOGIC: Count books in the BOOKS collection where
 *   authorId = this author's id. More than 0 = true.
 * WHY WE NEED IT: My spec says DELETE returns 409 if the
 *   author still has books.
 * LEARNING GAP: This one function reads the books collection,
 *   not authors, because books are what hold the authorId
 *   reference (books.authorId → authors.id). */
const authorHasBooks = async (authorId) => {
  const db = getDb();
  const collection = db.collection('books');
  const count = await collection.countDocuments({ authorId: authorId });
  return count > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
};
