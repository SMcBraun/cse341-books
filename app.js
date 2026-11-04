
/* ==========================================================
 * app.js — The Express application
 * PLAIN ENGLISH: Builds the app: JSON middleware, the root
 *   health-check route, the Swagger docs page, and the API
 *   routes from src/router.js.
 * LOGIC: Create app → express.json() → GET / → /api-docs
 *   (Swagger) → app.use(router) → export (server.js starts it).
 * WHY WE NEED IT: One central place that assembles the app.
 * LEARNING GAP: getDb is NOT imported here. Only models talk to
 *   the database. The practice /trails route was removed.
 * ========================================================== */
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import router from './src/router.js';

/* ----------------------------------------------------------
 * Swagger imports (the 2 new lines above)
 * PLAIN ENGLISH: Bring in the tool that shows the Swagger page,
 *   and the swagger.json file that holds my documentation.
 * LOGIC:
 *   - swaggerUi = the swagger-ui-express package.
 *   - swaggerDocument = the contents of swagger.json.
 *   - with { type: 'json' } tells Node "this file is JSON,"
 *     so it can be imported like code.
 * WHY WE NEED IT: The /api-docs page needs both pieces.
 * LEARNING GAP: Render only reads swagger.json. It does NOT run
 *   swagger.js, which is why swagger.json must be committed.
 * ---------------------------------------------------------- */

const app = express();

/* PLAIN ENGLISH: Read JSON sent in request bodies (req.body). */
app.use(express.json());

/* PLAIN ENGLISH: Health check, so "/" confirms the server is up.
 * LEARNING GAP: "return" before the response (course standard). */
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

/* ----------------------------------------------------------
 * /api-docs → the Swagger documentation page
 * PLAIN ENGLISH: When someone visits /api-docs, show the
 *   interactive Swagger page built from swagger.json.
 * LOGIC:
 *   - swaggerUi.serve = sends the page's files (styles, scripts).
 *   - swaggerUi.setup(swaggerDocument) = builds the page from
 *     my documentation.
 * WHY WE NEED IT: Lets me (and graders) read AND test the API
 *   in the browser, with "Try it out" and "Execute."
 * LEARNING GAP: This line must come AFTER "const app = express()",
 *   because app has to exist before we add routes to it.
 * ---------------------------------------------------------- */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* PLAIN ENGLISH: Plug in all API routes (like GET /books).
 * LEARNING GAP: router has no () here. We hand Express the
 *   router itself, the same idea as passing handler names. */
app.use(router);

export default app;