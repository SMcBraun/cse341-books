/* ==========================================================
 * src/db/connect.js — Database connection helper
 * ----------------------------------------------------------
 * PLAIN ENGLISH: This file opens ONE connection to MongoDB
 *   when the server starts, and lets any other file borrow
 *   that connection later.
 * LOGIC: connectToDb() connects and saves the database object.
 *   getDb() hands back that saved object whenever a route
 *   needs it.
 * WHY WE NEED IT: Connecting once at startup is faster and
 *   safer than connecting on every request. Keeping it in its
 *   own file keeps routes small (a course standard).
 * LEARNING GAP: This file is KEPT after the practice route is
 *   removed. You'll reuse it for the books assignment.
 * ========================================================== */

/* ----------------------------------------------------------
 * Import the MongoDB client
 * PLAIN ENGLISH: Bring in the "MongoClient" tool from the
 *   mongodb driver we just installed.
 * LOGIC: { MongoClient } with curly braces = a NAMED import
 *   (one specific tool out of the package).
 * WHY WE NEED IT: MongoClient is what actually opens the
 *   connection to Atlas.
 * LEARNING GAP: "import express from" (no braces) = default
 *   import. "import { MongoClient } from" (braces) = named
 *   import. The package decides which style you use.
 * ---------------------------------------------------------- */
import { MongoClient } from 'mongodb';

/* ----------------------------------------------------------
 * Saved database object
 * PLAIN ENGLISH: An empty "parking spot" that will hold the
 *   database once we're connected.
 * LOGIC: Starts as undefined. connectToDb() fills it in.
 * WHY WE NEED IT: getDb() checks this spot to hand the
 *   connection to routes.
 * LEARNING GAP: This uses "let", not "const", because its
 *   value CHANGES later (course standard: const by default,
 *   let only when reassigned, never var).
 * ---------------------------------------------------------- */
let database;

/* ----------------------------------------------------------
 * connectToDb — open the connection
 * PLAIN ENGLISH: Read the connection string from .env, connect
 *   to Atlas, and pick the "practice" database.
 * LOGIC:
 *   1. Read MONGODB_URI from process.env.
 *   2. If it's missing, stop with a clear error (fail fast).
 *   3. Create a client and await client.connect().
 *   4. Choose the database: MONGODB_DB_NAME if set, otherwise
 *      'practice'.
 *   5. Save it in "database" and return it.
 * WHY WE NEED IT: server.js calls this BEFORE listening, so the
 *   app never takes requests without a working database.
 * LEARNING GAP: "async" + "await" = wait for a slow task
 *   (connecting over the internet) to finish before moving
 *   on. This is the course standard instead of .then().
 *   The "|| 'practice'" means "use this backup value if the
 *   first one is empty."
 * ---------------------------------------------------------- */
const connectToDb = async () => {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
        throw new Error('MONGODB_URI is required.');
    }

    const client = new MongoClient(connectionString);
    await client.connect();
    database = client.db(process.env.MONGODB_DB_NAME || 'practice');
    return database;
};

/* ----------------------------------------------------------
 * getDb — borrow the connection
 * PLAIN ENGLISH: Give back the saved database so a route can
 *   use it.
 * LOGIC: If "database" is still empty, throw an error.
 *   Otherwise return it.
 * WHY WE NEED IT: Routes call getDb() instead of connecting
 *   again every time.
 * LEARNING GAP: The error only happens if someone forgot to
 *   call connectToDb() first. It's a safety net that names
 *   the exact problem.
 * ---------------------------------------------------------- */
const getDb = () => {
    if (!database) {
        throw new Error('Database not initialized. Call connectToDb first.');
    }
    return database;
};

/* ----------------------------------------------------------
 * Export both functions
 * PLAIN ENGLISH: Let other files use connectToDb and getDb.
 * LOGIC: Named exports, so other files import them with
 *   { connectToDb } or { getDb }.
 * WHY WE NEED IT: server.js needs connectToDb; app.js needs
 *   getDb.
 * LEARNING GAP: Named exports must be imported with the SAME
 *   name inside curly braces.
 * ---------------------------------------------------------- */
export { connectToDb, getDb };