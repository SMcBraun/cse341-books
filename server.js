/* ==========================================================
 * server.js — Starts the server ("opening the doors")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: This file takes the app from app.js, connects
 *   to MongoDB, and THEN starts listening for requests.
 * LOGIC: Import the app and connectToDb → read PORT → stop if
 *   PORT is missing → startServer(): connect to the database
 *   first, then listen. If the database fails, log it and stop.
 * WHY WE NEED IT: package.json "main" and the start/dev scripts
 *   all point to server.js as the starting file.
 * LEARNING GAP: app.js BUILDS the app; server.js RUNS it. Tests
 *   can import app.js without running this file, so no real
 *   port or database connection gets opened during testing.
 * ========================================================== */

/* ----------------------------------------------------------
 * Import the app
 * PLAIN ENGLISH: Bring in the Express app we built in app.js.
 * LOGIC: Loads whatever app.js exported with "export default".
 * WHY WE NEED IT: We can't start an app we don't have.
 * LEARNING GAP: The "./" means "in this same folder," and the
 *   ".js" ending is REQUIRED with "type": "module". Leaving off
 *   ".js" causes a "Cannot find module" error.
 * ---------------------------------------------------------- */
import app from './app.js';

/* ----------------------------------------------------------
 * Import the database connector
 * PLAIN ENGLISH: Bring in the function that opens the MongoDB
 *   connection.
 * LOGIC: A NAMED import (curly braces) from src/db/connect.js.
 * WHY WE NEED IT: We must connect before taking requests.
 * LEARNING GAP: The path goes into folders: ./src/db/connect.js.
 *   The name inside { } must match the export exactly.
 * ---------------------------------------------------------- */
import { connectToDb } from './src/db/connect.js';

/* ----------------------------------------------------------
 * Read the PORT setting
 * PLAIN ENGLISH: Get the door number from the .env file.
 * LOGIC: --env-file=.env (in the npm scripts) loads PORT=3000
 *   into process.env, and we read it from there.
 * WHY WE NEED IT: Locally it's 3000. On Render, Render sets its
 *   own PORT. Same code works in both places.
 * LEARNING GAP: Use const, never var (course standard). In the
 *   W01 lint test, "npm run lint:fix" changed var back to const
 *   automatically. process.env values are always TEXT ("3000"),
 *   not numbers, and app.listen() accepts text, so that's fine.
 * ---------------------------------------------------------- */
const PORT = process.env.PORT;

/* ----------------------------------------------------------
 * Safety check: stop if PORT is missing
 * PLAIN ENGLISH: If there is no door number, stop right away
 *   with a clear message instead of failing in a confusing way.
 * LOGIC: !PORT is true when PORT is empty or undefined.
 *   "throw new Error" stops the program and prints the message.
 * WHY WE NEED IT: It tells you immediately when .env isn't
 *   being read (for example, running "node server.js" without
 *   the --env-file flag).
 * LEARNING GAP: This is "fail fast" — catch the problem at the
 *   start, like rejecting a chart with a missing DOS before
 *   coding it, instead of discovering it at the end.
 * ---------------------------------------------------------- */
if (!PORT) {
    throw new Error('PORT is not defined. Make sure your local npm scripts reference the .env file with --env-file=.env, or define PORT in your hosted environment settings.');
}

/* ----------------------------------------------------------
 * startServer — connect first, then listen
 * PLAIN ENGLISH: Open the database connection. If that works,
 *   open the door for requests. If it fails, say so and stop.
 * LOGIC:
 *   try: await connectToDb() → then app.listen(PORT, ...).
 *   catch: console.error a short message → process.exit(1).
 * WHY WE NEED IT: Routes like GET /trails need the database.
 *   Starting without it would make every request fail.
 * LEARNING GAP:
 *   - "async/await + try/catch" is the course standard
 *     (not .then()/.catch()).
 *   - error.message prints only the short reason, not the
 *     whole technical dump.
 *   - process.exit(1) stops the app. "1" means "stopped
 *     because of a problem" (0 would mean "finished fine").
 * ---------------------------------------------------------- */
const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server listening at 127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

/* ----------------------------------------------------------
 * Run it
 * PLAIN ENGLISH: Actually start everything.
 * LOGIC: Calls the startServer function defined above.
 * WHY WE NEED IT: Defining a function doesn't run it. This
 *   line does.
 * LEARNING GAP: Forgetting this line = nothing happens, and
 *   no error appears. The server just never starts.
 * ---------------------------------------------------------- */
startServer();