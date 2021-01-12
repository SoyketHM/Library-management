const loanCrud          = require('../services/bookLoanCrud');
const _p       				= require('../helpers/simpleasync');
const { createResponse }    = require('../utils/responseGenerate');

/**
 * @swagger
 *
 * definitions:
 *   BookLoan:
 *     type: object
 *     properties:
 *       memberId:
 *         type: string
 *         example: 5fd2720f5cabea283cd3cfe2
 *       books:
 *         type: array
 *         example: [5fd2720f5cabea283cd3cfe2]
 *       receiveDate:
 *         type: date
 *         example: 2020-12-08T20:51:20.208Z
 *       returnDate:
 *         type: date
 *         example: 2020-12-12T20:51:20.208Z
 *       status:
 *         type: string
 *         example: pending/accept/reject/return
 */

/**
 * @swagger
 *
 * /api/books-loan:
 *   post:
 *     tags: [books-loan]
 *     description: Create a new loan book
 *     produces:
 *       - application/json
 *     parameters: 
 *     - name: token
 *       description: User token
 *       in:  header
 *     - in:  body
 *       name: Loan Book Data
 *       schema:
 *         $ref: '#/definitions/BookLoan'
 *     responses:
 *       200:
 *         description: OK
 *         schema: 
 *           $ref: '#/definitions/BookLoan'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *				 	"books": [
 *						"5fcfc5a92a90f93cac013892"
 *					],
 *					"status": "return",
 *					"_id": "5fcfe72b784d8643e4fae212",
 *					"receiveDate": "2020-12-08T18:24:55.000Z",
 *					"returnDate": "2020-12-15T18:24:55.000Z",
 *					"memberId": "5fcfa2f4666c5931606d5fce",
 *					"createdAt": "2020-12-08T20:50:51.970Z",
 *					"updatedAt": "2020-12-08T20:51:20.208Z",
 *					"__v": 0
 *				},
 *               "message": "loan created successfully"
 *             } 
 *         
 */
module.exports.createLoan = async (req, res, next) => {
	req.body.memberId = req.user.id;
	const [error, loan] = await _p(loanCrud.createLoan(req.body));

	if (error) {
		console.log(error);
		return next(new Error('books loan creation failed' ));
	}
	return res.status(200).json(createResponse(loan, 'books loan created successfully'));
};

/**
 * @swagger
 *
 * /api/books-loan:
 *   get:
 *     tags: [books-loan]
 *     description: Get all loan book
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
 *           $ref: '#/definitions/BookLoan'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": [{
 *				 	"books": [
 *						"5fcfc5a92a90f93cac013892"
 *					],
 *					"status": "return",
 *					"_id": "5fcfe72b784d8643e4fae212",
 *					"receiveDate": "2020-12-08T18:24:55.000Z",
 *					"returnDate": "2020-12-15T18:24:55.000Z",
 *					"memberId": "5fcfa2f4666c5931606d5fce",
 *					"createdAt": "2020-12-08T20:50:51.970Z",
 *					"updatedAt": "2020-12-08T20:51:20.208Z",
 *					"__v": 0
 *				},
 * 				{
 *				 	"books": [
 *						"5fcfc5a92a90f93cac013892"
 *					],
 *					"status": "return",
 *					"_id": "5fcfe72b784d8643e4fae212",
 *					"receiveDate": "2020-12-08T18:24:55.000Z",
 *					"returnDate": "2020-12-15T18:24:55.000Z",
 *					"memberId": "5fcfa2f4666c5931606d5fce",
 *					"createdAt": "2020-12-08T20:50:51.970Z",
 *					"updatedAt": "2020-12-08T20:51:20.208Z",
 *					"__v": 0
 *				}],
 *                  "message": null
 *             } 
 *         
 */
module.exports.getLoans = async (req, res, next) => {
	const [error, loans] = await _p(loanCrud.getLoans(req.query));

	if(error) {
		console.log(error);
		return next(new Error('books loan fetch error'));
	}
	return res.status(200).json(createResponse(loans));
};

/**
 * @swagger
 *
 * /api/books-loan/{id}:
 *   get:
 *     tags: [books-loan]
 *     description: Update loan book id
 *     produces:
 *       - application/json
 *     parameters: 
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: Loan book id
 *         in:  path
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema: 
 *           $ref: '#/definitions/BookLoan'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *				 	"books": [
 *						"5fcfc5a92a90f93cac013892"
 *					],
 *					"status": "return",
 *					"_id": "5fcfe72b784d8643e4fae212",
 *					"receiveDate": "2020-12-08T18:24:55.000Z",
 *					"returnDate": "2020-12-15T18:24:55.000Z",
 *					"memberId": "5fcfa2f4666c5931606d5fce",
 *					"createdAt": "2020-12-08T20:50:51.970Z",
 *					"updatedAt": "2020-12-08T20:51:20.208Z",
 *					"__v": 0
 *				},
 *                  "message": null
 *             } 
 *         
 */
module.exports.getLoanById = async (req, res, next) => {
	const [error, loan] = await _p(loanCrud.getLoanById(req.params.id));

	if(error) {
		console.log(error);
		return next(new Error('books loan fetch error'));
	}

	if(!loan) {
		return res.status(200).json(createResponse(null, 'books loan not found'));
	}
	return res.status(200).json(createResponse(loan));
};

/**
 * @swagger
 *
 * /api/books-loan/{id}:
 *   put:
 *     tags: [books-loan]
 *     description: Update loan book id
 *     produces:
 *       - application/json
 *     parameters: 
 *     - name: token
 *       description: User token
 *       in:  header
 *     - name: id
 *       description: Loan book id
 *       in:  path
 *       type: string
 *     - in:  body
 *       name: Loan Book Data
 *       schema:
 *         $ref: '#/definitions/BookLoan'
 *     responses:
 *       200:
 *         description: OK
 *         schema: 
 *           $ref: '#/definitions/BookLoan'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *				 	"books": [
 *						"5fcfc5a92a90f93cac013892"
 *					],
 *					"status": "return",
 *					"_id": "5fcfe72b784d8643e4fae212",
 *					"receiveDate": "2020-12-08T18:24:55.000Z",
 *					"returnDate": "2020-12-15T18:24:55.000Z",
 *					"memberId": "5fcfa2f4666c5931606d5fce",
 *					"createdAt": "2020-12-08T20:50:51.970Z",
 *					"updatedAt": "2020-12-08T20:51:20.208Z",
 *					"__v": 0
 *				},
 *                  "message": "loan updated successfully"
 *             } 
 *         
 */
module.exports.updateLoanById = async (req, res, next) => {
	if (req.body.memberId) delete req.body.memberId;
	let [error, loan] = await _p(loanCrud.updateLoanById(req.params.id, req.body));

	if(error) {
		console.log(error);
		return next(new Error('books loan access error'));
	}
	if(!loan) {
		return res.status(200).json(createResponse(null, 'books loan not found'));
	}
	return res.status(200).json(createResponse(loan, 'books loan updated successfully'));
};

/**
 * @swagger
 *
 * /api/books-loan/{id}:
 *   delete:
 *     tags: [books-loan]
 *     description: Delete loan book id
 *     produces:
 *       - application/json
 *     parameters: 
 *     - name: token
 *       description: User token
 *       in:  header
 *     - name: id
 *       description: Loan book id
 *       in:  path
 *       type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema: 
 *           $ref: '#/definitions/BookLoan'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": null,
 *               "message": "loan deleted successfully"
 *             } 
 *         
 */
module.exports.deleteLoanById = async (req, res, next) => {
	let [error, loan] = await _p(loanCrud.deleteLoanById(req.params.id));

	if(error) {
		console.log(error);
		return next(new Error('books loan access error'));
	}
	if(!loan) {
		return res.status(200).json(createResponse(null, 'books loan not found'));
	}
	return res.status(200).json(createResponse(null, 'books loan deleted successfully'));
};

/**
 * @swagger
 *
 * /api/books-loan/{id}:
 *   delete:
 *     tags: [books-loan]
 *     description: Delete loan book id
 *     produces:
 *       - application/json
 *     parameters: 
 *     - name: token
 *       description: User token
 *       in:  header
 *     - name: id
 *       description: Loan book id
 *       in:  path
 *       type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema: 
 *           $ref: '#/definitions/BookLoan'
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": null,
 *               "message": "loan deleted successfully"
 *             } 
 *         
 */
module.exports.exportLoan = async (req, res, next) => {
	let [error, status] = await _p(loanCrud.exportLoan());

	if(error) {
		console.log(error);
		return next(new Error('books loan access error'));
	}
	if(!status) {
		return res.status(200).json(createResponse(null, 'books loan not found'));
	}
	return res.status(200).json(createResponse(status, 'books loan export successfully'));
};
