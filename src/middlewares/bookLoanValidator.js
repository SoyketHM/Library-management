const { check }    = require('express-validator');

module.exports.bookLoanValidator = [
	check('books')
		.optional().isArray().withMessage('Book Id must be an array'),
	check('receiveDate')
		.optional().exists({ checkNull: true, checkFalsy: true }).bail().isString().withMessage('receiveDate must be a string'),
	check('returnDate')
		.optional().exists({ checkNull: true, checkFalsy: true }).bail().isString().withMessage('returnDate must be a string'),
	check('status')
		.optional().exists({ checkNull: true, checkFalsy: true }).bail().isString().withMessage('Status must be a string'),
];