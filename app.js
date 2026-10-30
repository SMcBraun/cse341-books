/* ==========================================================
 * app.js — The Express application (the "restaurant")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: This file builds the app — its settings and
 *   its routes (the "menu"). It does NOT start the server.
 * LOGIC: Create the app → add middleware → add routes → export
 *   it so server.js (and later, tests) can use it.
 * WHY WE NEED IT: Keeping the app separate from the server
 *   startup lets tests load the app without opening a real port.
 * LEARNING GAP: In CSE 340, one file often did everything
 *   (built the app AND started it). Here the job is split into
 *   two files: app.js = the restaurant, server.js = opening
 *   the doors.
 * ========================================================== */

/* ----------------------------------------------------------
 * Import Express
 * PLAIN ENGLISH: Bring in the Express toolkit we installed
 *   with npm.
 * LOGIC: "import ... from 'express'" loads the package from
 *   node_modules.
 * WHY WE NEED IT: Express handles requests, routes, and
 *   responses so we don't have to build that from scratch.
 * LEARNING GAP: "import" only works because package.json has
 *   "type": "module". With "commonjs" you would need
 *   require('express') instead.
 * ---------------------------------------------------------- */
import express from 'express';

/* ----------------------------------------------------------
 * Create the Express application
 * PLAIN ENGLISH: Make our app — one "restaurant" instance.
 * LOGIC: Calling express() returns a new app object that we
 *   attach settings and routes to.
 * WHY WE NEED IT: Everything else (middleware, routes) gets
 *   added to this "app" object.
 * LEARNING GAP: "express" (the toolkit) and "app" (our one
 *   restaurant built with it) are different things.
 * ---------------------------------------------------------- */
const app = express();

/* ----------------------------------------------------------
 * JSON request body middleware
 * PLAIN ENGLISH: Teach the app to read JSON that clients send
 *   to us.
 * LOGIC: express.json() runs on every incoming request. If the
 *   body is JSON, it turns it into a JavaScript object at
 *   req.body.
 * WHY WE NEED IT: Later, POST and PUT requests will send book
 *   data as JSON. Without this, req.body would be undefined.
 * LEARNING GAP: "Middleware" = a checkpoint every request
 *   passes through before reaching a route — like intake at
 *   a doctor's office before seeing the provider.
 * ---------------------------------------------------------- */
app.use(express.json());

/* ----------------------------------------------------------
 * Root route: GET /
 * PLAIN ENGLISH: When someone visits the home address ("/"),
 *   send back a short JSON message saying the server works.
 * LOGIC: app.get('/', ...) matches GET requests to "/".
 *   res.status(200) sets "OK", and .json({...}) sends data
 *   as JSON.
 * WHY WE NEED IT: It's a quick health check — if you see this
 *   message, the server is running.
 * LEARNING GAP: In CSE 340 you used res.render() to send an
 *   HTML page. In web services we use res.json() to send DATA.
 *   "return" makes sure nothing else runs after the response.
 *   It's a course standard, and ESLint flags it if missing
 *   (the W01 lint test proved this).
 * ---------------------------------------------------------- */
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

/* ----------------------------------------------------------
 * Export the app
 * PLAIN ENGLISH: Make this app available to other files.
 * LOGIC: "export default app" lets server.js write
 *   "import app from './app.js'".
 * WHY WE NEED IT: server.js needs the app to start it, and
 *   future tests will import it too.
 * LEARNING GAP: Without this export, server.js would have
 *   nothing to import and would crash.
 * ---------------------------------------------------------- */
export default app;