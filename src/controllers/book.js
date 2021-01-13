const bookCrud   		    = require('../services/bookCrud');
const _p       				= require('../helpers/simpleasync');
const { createResponse }    = require('../utils/responseGenerate');

/**
 * @swagger
 *
 * definitions:
 *   Book:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: The Knight One
 *       author:
 *         type: string
 *         example: 5fd101f7f5b9e63d207296a3
 *       genre:
 *         type: string
 *         example: Fantasy
 *       status:
 *         type: string
 *         example: available/borrowed
 */

/**
 * @swagger
 *
 * /api/books:
 *   post:
 *     tags: [books]
 *     description: Create a new book
 *     produces:
 *       - application/json
 *     parameters: 
 *     - name: token
 *       description: User token
 *       in:  header
 *     - in:  body
 *       name: Book Data
 *       schema:
 *         $ref: '#/definitions/Book'
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Book'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *					"status": "active",
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "The Knight One",
 *					"author": "5fd101f7f5b9e63d207296a3",
 *					"genre": "Fantasy",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 *               "message": "book created successfully"
 *             } 
 *         
 */
module.exports.createBook = async (req, res, next) => {
	const [error, book] = await _p(bookCrud.createBook(req.body));

	if (error) {
		console.log(error);
		return next(new Error('book creation failed' ));
	}
	return res.status(200).json(createResponse(book, 'book created successfully'));
};

/**
 * @swagger
 *
 * /api/books:
 *   get:
 *     tags: [books]
 *     description: Get all books
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: author
 *         in: query
 *         description: The author id
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Book'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": [{
 *					"status": "active",
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "The Knight One",
 *					"author": "5fd101f7f5b9e63d207296a3",
 *					"genre": "Travel",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 * 				{
 *					"status": "active",
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "The Knight",
 *					"author": "5fd101f7f5b9e63d207296a3",
 *					"genre": "Fantasy",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				}],
 *               "message": null
 *             } 
 *         
 */
module.exports.getBooks = async (req, res, next) => {
	const [error, books] = await _p(bookCrud.getBooks(req.query));

	if(error) {
		console.log(error);
		return next(new Error('book fetch error'));
	}
	return res.status(200).json(createResponse(books));
};

/**
 * @swagger
 *
 * /api/books/{id}:
 *   get:
 *     tags: [books]
 *     description: Get book by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Book id
 *         in:  path
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Book'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *					"status": "active",
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "The Knight One",
 *					"author": "5fd101f7f5b9e63d207296a3",
 *					"genre": "Fantasy",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 *               "message": null
 *             } 
 *         
 */
module.exports.getBookById = async (req, res, next) => {
	const [error, book] = await _p(bookCrud.getBookById(req.params.id));

	if(error) {
		console.log(error);
		return next(new Error('book fetch error'));
	}

	if(!book) {
		return res.status(200).json(createResponse(null, 'book not found'));
	}
	return res.status(200).json(createResponse(book));
};

/**
 * @swagger
 *
 * /api/books/{id}:
 *   put:
 *     tags: [books]
 *     description: Update book by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Book id
 *         in:  path
 *         type: string
 *       - in:  body
 *         name: Book Data
 *         schema:
 *           $ref: '#/definitions/Book'
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Book'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *					"status": "active",
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "The Knight One",
 *					"author": "David",
 *					"genre": "Fantasy",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 *               "message": "book updated successfully"
 *             } 
 *         
 */
module.exports.updateBookById = async (req, res, next) => {
	let [error, book] = await _p(bookCrud.updateBookById(req.params.id, req.body));

	if(error) {
		console.log(error);
		return next(new Error('book access error'));
	}
	if(!book) {
		return res.status(200).json(createResponse(null, 'book not found'));
	}
	return res.status(200).json(createResponse(book, 'book updated successfully'));
};

/**
 * @swagger
 *
 * /api/books/{id}:
 *   delete:
 *     tags: [books]
 *     description: Delete book by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Book id
 *         in:  path
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Book'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": null,
 *               "message": "book deleted successfully"
 *             } 
 *         
 */
module.exports.deleteBookById = async (req, res, next) => {
	let [error, book] = await _p(bookCrud.deleteBookById(req.params.id));

	if(error) {
		console.log(error);
		return next(new Error('book access error'));
	}
	if(!book) {
		return res.status(200).json(createResponse(null, 'book not found'));
	}
	return res.status(200).json(createResponse(null, 'book deleted successfully'));
};
