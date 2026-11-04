/* ==========================================================
 * swagger.js — Swagger documentation GENERATOR
 * PLAIN ENGLISH: Builds the swagger.json file that powers the
 *   /api-docs page. Run it with "npm run swagger".
 * LOGIC: Settings (API name, version) + which files to read →
 *   swagger-jsdoc finds the @openapi comments → writes them
 *   into swagger.json.
 * WHY WE NEED IT: Turns my route comments into documentation I
 *   can read AND test in the browser.
 * LEARNING GAP: This file only runs on MY computer while
 *   building docs. Render never runs it; Render just serves the
 *   finished swagger.json. That's why swagger-jsdoc is a
 *   dev dependency.
 * ========================================================== */

/* ----------------------------------------------------------
 * Imports
 * PLAIN ENGLISH: Bring in the "write a file" tool and the
 *   swagger-jsdoc package.
 * LOGIC: writeFileSync comes from Node's built-in file system
 *   ("node:fs"). swaggerJsdoc reads the @openapi comments.
 * WHY WE NEED IT: We need both to build and save swagger.json.
 * LEARNING GAP: "node:fs" is built into Node, so nothing extra
 *   to install. The "node:" prefix makes that clear.
 * ---------------------------------------------------------- */
import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';

/* ----------------------------------------------------------
 * options — the settings for the documentation
 * PLAIN ENGLISH: The API's name and description, the server
 *   address, and which files hold the @openapi comments.
 * LOGIC:
 *   - openapi: '3.0.0' = use the current OpenAPI 3 format.
 *   - info = the title, version, and description shown at the
 *     top of the Swagger page.
 *   - servers url '/' = "use whatever server I'm on," so it
 *     works locally AND on Render.
 *   - apis = the files swagger-jsdoc reads for comments.
 * WHY WE NEED IT: swagger-jsdoc needs these settings to build
 *   the docs.
 * LEARNING GAP: If a route is missing from Swagger, check that
 *   its file is listed in "apis".
 * ---------------------------------------------------------- */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'A simple API for working with books'
        },
        servers: [
            {
                url: '/',
                description: 'Current server'
            }
        ]
    },
    apis: ['./src/router.js', './app.js']
};

/* ----------------------------------------------------------
 * Build and save swagger.json
 * PLAIN ENGLISH: Create the documentation and save it as a file.
 * LOGIC:
 *   - swaggerJsdoc(options) builds the documentation object.
 *   - JSON.stringify(..., null, 2) turns it into neatly
 *     indented text (2 spaces).
 *   - writeFileSync saves it as ./swagger.json.
 * WHY WE NEED IT: app.js will read swagger.json to show the
 *   /api-docs page.
 * LEARNING GAP: Re-run "npm run swagger" every time you change
 *   routes or @openapi comments, or the docs will be out of date.
 * ---------------------------------------------------------- */
const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated.');