/* ==========================================================
 * server.js — Starts the server ("opening the doors")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: This file takes the app from app.js and
 *   starts it on a port so the browser can reach it.
 * LOGIC: Import the app → read PORT from the environment →
 *   stop with a clear error if PORT is missing → start
 *   listening.
 * WHY WE NEED IT: package.json "main" and the start/dev scripts
 *   all point to server.js as the starting file.
 * LEARNING GAP: app.js BUILDS the app; server.js RUNS it. Tests
 *   can import app.js without running this file, so no real
 *   port gets opened during testing.
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
 * Start the server
 * PLAIN ENGLISH: Open the door and wait for requests on PORT.
 * LOGIC: app.listen(PORT, callback) starts the server. Once
 *   it's ready, the callback prints a message in the terminal.
 * WHY WE NEED IT: Without listen(), the app exists but nothing
 *   can reach it.
 * LEARNING GAP: The message uses backticks ` ` (template
 *   literal), not quotes, so ${PORT} gets filled in with 3000.
 *   With regular quotes it would print "${PORT}" literally.
 * ---------------------------------------------------------- */
app.listen(PORT, () => {
    console.log(`Server listening at 127.0.0.1:${PORT}`);
});