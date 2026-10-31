/* ==========================================================
 * server.js — Starts the server ("opening the doors")
 * PLAIN ENGLISH: Connect to MongoDB first, then start listening.
 * LOGIC: Import app + connectToDb → check PORT → startServer():
 *   connect → listen. On failure: log a short message + stop.
 * WHY WE NEED IT: Routes need the database ready before requests.
 * LEARNING GAP: app.js BUILDS the app; server.js RUNS it. During
 *   Issue #1, a temporary test here printed the books to prove
 *   the connection to cse341-books-db worked; it was then removed.
 * ========================================================== */
import app from './app.js';

/* PLAIN ENGLISH: Bring in the function that opens the database.
 * LEARNING GAP: Named import, so the name in { } must match the
 *   export in src/db/connect.js. getDb is NOT needed here (only
 *   models use it). */
import { connectToDb } from './src/db/connect.js';

/* PLAIN ENGLISH: Get the door number from .env (or Render).
 * LEARNING GAP: const, never var (course standard). */
const PORT = process.env.PORT;

/* PLAIN ENGLISH: Stop right away with a clear message if PORT
 *   is missing ("fail fast," like rejecting a chart with no DOS). */
if (!PORT) {
    throw new Error('PORT is not defined. Make sure your local npm scripts reference the .env file with --env-file=.env, or define PORT in your hosted environment settings.');
}

/* PLAIN ENGLISH: Connect to the database, then open the doors.
 * LOGIC: try → await connectToDb() → listen. catch → log a
 *   short message → process.exit(1) (1 = stopped by a problem).
 * LEARNING GAP: async/await + try/catch is the course standard. */
const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server listening at 127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();
