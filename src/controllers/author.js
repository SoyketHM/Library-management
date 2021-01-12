const authorCrud   		    = require('../services/authorCrud');
const _p       				= require('../helpers/simpleasync');
const { createResponse }    = require('../utils/responseGenerate');

/**
 * @swagger
 *
 * definitions:
 *   Author:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: David
 */

/**
 * @swagger
 *
 * /api/authors:
 *   post:
 *     tags: [authors]
 *     description: Create a new author
 *     produces:
 *       - application/json
 *     parameters: 
 *     - name: token
 *       description: User token
 *       in:  header
 *     - in:  body
 *       name: Author Data
 *       schema:
 *         $ref: '#/definitions/Author'
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Author'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "David",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 *               "message": "author created successfully"
 *             } 
 *         
 */
module.exports.createAuthor = async (req, res, next) => {
	const [error, author] = await _p(authorCrud.createAuthor(req.body));

	if (error) {
		console.log(error);
		return next(new Error('author creation failed' ));
	}
	return res.status(200).json(createResponse(author, 'author created successfully'));
};

/**
 * @swagger
 *
 * /api/authors:
 *   get:
 *     tags: [authors]
 *     description: Get all authors
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Author'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": [{
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "David",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 * 				{
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "Thomas",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				}],
 *               "message": null
 *             } 
 *         
 */
module.exports.getAuthors = async (req, res,next) => {
	const [error, authors] = await _p(authorCrud.getAuthors(req.query));

	if(error) {
		console.log(error);
		return next(new Error('author fetch error'));
	}
	return res.status(200).json(createResponse(authors));
};

/**
 * @swagger
 *
 * /api/authors/{id}:
 *   get:
 *     tags: [authors]
 *     description: Get author by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Author id
 *         in:  path
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Author'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "David",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 *               "message": null
 *             } 
 *         
 */
module.exports.getAuthorById = async (req, res,next) => {
	const [error, author] = await _p(authorCrud.getAuthorById(req.params.id));

	if(error) {
		console.log(error);
		return next(new Error('author fetch error'));
	}

	if(!author) {
		return res.status(200).json(createResponse(null, 'author not found'));
	}
	return res.status(200).json(createResponse(author));
};

/**
 * @swagger
 *
 * /api/authors/{id}:
 *   put:
 *     tags: [authors]
 *     description: Update author by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Author id
 *         in:  path
 *         type: string
 *       - in:  body
 *         name: Author Data
 *         schema:
 *           $ref: '#/definitions/Author'
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Author'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *					"_id": "5fd101f7f5b9e63d207296a3",
 *					"name": "David Jon",
 *					"createdAt": "2020-12-09T16:57:27.684Z",
 *					"updatedAt": "2020-12-09T16:57:27.684Z",
 *					"__v": 0
 *				},
 *               "message": "author updated successfully"
 *             } 
 *         
 */
module.exports.updateAuthorById = async (req, res,next) => {
	let [error, author] = await _p(authorCrud.updateAuthorById(req.params.id, req.body));

	if(error) {
		console.log(error);
		return next(new Error('author access error'));
	}
	if(!author) {
		return res.status(200).json(createResponse(null, 'author not found'));
	}
	return res.status(200).json(createResponse(author, 'author updated successfully'));
};

/**
 * @swagger
 *
 * /api/authors/{id}:
 *   delete:
 *     tags: [authors]
 *     description: Delete author by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Author id
 *         in:  path
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": null,
 *               "message": "author deleted successfully"
 *             } 
 *         
 */
module.exports.deleteAuthorById = async (req, res,next) => {
	let [error, author] = await _p(authorCrud.deleteAuthorById(req.params.id));

	if(error) {
		console.log(error);
		return next(new Error('author access error'));
	}
	if(!author) {
		return res.status(200).json(createResponse(null, 'author not found'));
	}
	return res.status(200).json(createResponse(null, 'author deleted successfully'));
};
