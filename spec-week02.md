# Books API Week 02 Spec

---------------------------------------------------------------

# Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection and provide all CRUD operations for authors. Books reference authors through `authorId`, so an author cannot be deleted while books still point to them. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required, such as `1775`

Authors will use custom string ids instead of MongoDB `_id` values for route parameters, the same as books.

Example document:

    {
      "id": "a1",
      "name": "Jane Austen",
      "birthYear": 1775
    }

### Relationship to Books
An author can have zero or many books. A book points to its author with `books.authorId`, which matches `authors.id`. The author document does not store a list of books.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books (at least one book has `authorId` equal to this author's `id`). The author is not deleted.
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route, including request bodies with example JSON for POST and PUT.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---------------------------------------------------------------

# Spec Evaluation (AI Review of Version 1)

### Are there any bugs or short-sighted decisions?
- PUT does not say what happens if the body includes an `id`. A client could try to change the id and break book references. The id should come only from the URL.
- Field types are not checked. `birthYear: "abc"` or `title: 123` would be saved.
- The order of checks is not stated. If a PUT has a bad body AND a missing id, should the API return 400 or 404?
- `publicationDate` has no format, so `"Jan 5"` and `"2026-01-05"` would both be accepted.

### Are there any security considerations missing?
- Extra fields: if the API saves `req.body` directly, a client could add any field they want (for example `"isAdmin": true`). Only the listed fields should be saved.
- Query injection: if `id` or `authorId` is sent as an object such as `{ "$ne": null }` instead of a string, MongoDB could treat it as a query operator and match the wrong document. All id fields must be plain strings.
- Raw database error messages should never be sent to the client.

### Are there any efficiency concerns?
- `GET /books` and `GET /authors` return everything. That is fine for a small class project, but a large collection would need paging later.
- Checking "author exists" and "author has books" each add one extra database query. That is acceptable at this size.

### Are any response examples or error behaviors unclear?
- The JSON shape of error responses is not defined.
- The 400 for a duplicate id and the 409 for deleting an author with books should each have a clear message so the client knows what went wrong.

---------------------------------------------------------------

# Version 2

## Rules That Apply to Both Features
- All error responses use this JSON shape: `{ "message": "Explanation here." }`
- Raw database or server errors are never sent to the client. A `500` returns a general message only.
- Only the fields listed in each data model are saved. Any extra fields in the request body are ignored.
- On PUT, the `id` comes only from the URL. An `id` in the request body is ignored, so ids can never change.
- All string fields must be of type string and not empty after trimming spaces. Leading and trailing spaces are trimmed before saving.
- All id fields (`id`, `authorId`) must be plain strings. Objects or arrays are rejected with `400`.
- Responses may include MongoDB's automatic `_id` field. Clients should use the custom `id` field.
- Order of checks on write routes: (1) validate the request body (400), (2) check that the record exists (404), (3) check relationships (400 or 409), (4) write to the database.

## Feature 1 (V2): Book CRUD Operations and Author References

### Data Model
Collection: `books`

| Field | Type | Rules |
|---|---|---|
| `id` | string | required, unique, custom id such as `b1` |
| `authorId` | string | required, must match the `id` of an existing author |
| `title` | string | required, not empty |
| `publicationDate` | string | required, format `YYYY-MM-DD` |

### Routes

#### GET /books
- `200`: array of book objects (empty array `[]` if there are no books)
- `500`: `{ "message": "Unable to retrieve books." }`

#### GET /books/:id
- `200`: the matching book object
- `404`: `{ "message": "Book not found." }`
- `500`: `{ "message": "Unable to retrieve book." }`

#### POST /books
Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

- `201`: the newly created book object
- `400`: `{ "message": "Missing or invalid book fields." }` when a field is missing, has the wrong type, or `publicationDate` is not `YYYY-MM-DD`
- `400`: `{ "message": "Book id already exists." }`
- `400`: `{ "message": "Author not found for the given authorId." }`
- `500`: `{ "message": "Unable to create book." }`

#### PUT /books/:id
Request body (any `id` in the body is ignored):

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

- `200`: the updated book object, including its `id`
- `400`: `{ "message": "Missing or invalid book fields." }`
- `404`: `{ "message": "Book not found." }`
- `400`: `{ "message": "Author not found for the given authorId." }`
- `500`: `{ "message": "Unable to update book." }`

#### DELETE /books/:id
- `204`: no response body
- `404`: `{ "message": "Book not found." }`
- `500`: `{ "message": "Unable to delete book." }`

Deleting a book does not change its author.

### Data Migration
Every existing Week 01 book document is updated in MongoDB Atlas to include an `authorId` that matches an existing author. Any old author-name field is removed so the author name is stored only in the `authors` collection.

### Swagger Documentation
- Every book route is documented under the `Books` tag.
- POST and PUT include a `requestBody` with field types, required fields, and an example.
- `:id` routes document the `id` path parameter.
- Every status code listed above is documented.

### Deployment Expectations
All book routes work locally and on Render, and can be tested from the deployed `/api-docs` page.

## Feature 2 (V2): Author CRUD Operations

### Data Model
Collection: `authors`

| Field | Type | Rules |
|---|---|---|
| `id` | string | required, unique, custom id such as `a1` |
| `name` | string | required, not empty |
| `birthYear` | number | required, whole number, not greater than the current year |

### Routes

#### GET /authors
- `200`: array of author objects (empty array `[]` if there are no authors)
- `500`: `{ "message": "Unable to retrieve authors." }`

#### GET /authors/:id
- `200`: the matching author object
- `404`: `{ "message": "Author not found." }`
- `500`: `{ "message": "Unable to retrieve author." }`

#### POST /authors
Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

- `201`: the newly created author object
- `400`: `{ "message": "Missing or invalid author fields." }` when a field is missing, has the wrong type, or `birthYear` is not a whole number up to the current year
- `400`: `{ "message": "Author id already exists." }`
- `500`: `{ "message": "Unable to create author." }`

#### PUT /authors/:id
Request body (any `id` in the body is ignored):

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

- `200`: the updated author object, including its `id`
- `400`: `{ "message": "Missing or invalid author fields." }`
- `404`: `{ "message": "Author not found." }`
- `500`: `{ "message": "Unable to update author." }`

#### DELETE /authors/:id
- `204`: no response body
- `404`: `{ "message": "Author not found." }`
- `409`: `{ "message": "Author cannot be deleted because they still have books." }`
- `500`: `{ "message": "Unable to delete author." }`

Delete behavior when the author still has books: the API counts books where `authorId` equals this author's `id`. If the count is more than zero, the author is NOT deleted and the API returns `409 Conflict`. The client must delete those books or move them to another author first. Books are never deleted automatically, so no data is lost by accident.

Why 409 and not 400: the request itself is valid, but it conflicts with the current state of the data (books still point to this author). That is what `409 Conflict` means.

### Initial Data
At least three author documents (`a1`, `a2`, `a3`) are created in MongoDB Atlas before the book changes are made.

### Swagger Documentation
- Every author route is documented under the `Authors` tag.
- POST and PUT include a `requestBody` with field types, required fields, and an example.
- `:id` routes document the `id` path parameter.
- Every status code listed above is documented, including `409` on DELETE.

### Deployment Expectations
All author routes work locally and on Render, and can be tested from the deployed `/api-docs` page.

## Known Limitations (Future Work)
- No paging on `GET /books` or `GET /authors`.
- Uniqueness of `id` is checked in code. Two requests sent at the exact same moment could both pass the check. A unique index in MongoDB would fully prevent this later.
- No authentication yet. Anyone with the URL can create, update, or delete data.