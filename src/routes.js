const router				=	require('express').Router();
const health				=	require('./controllers/health');
const userController	    =	require('./controllers/user');
const bookController	    =	require('./controllers/book');
const authorController	    =	require('./controllers/author');
const loanController	    =	require('./controllers/bookLoan');

const { userValidator, loginValidator }	=	require('./middlewares/userValidator');
const { bookValidator }		    =	require('./middlewares/bookValidator');
const { authorValidator }	    =	require('./middlewares/authorValidator');
const { bookLoanValidator }		=	require('./middlewares/bookLoanValidator');
const { checkInvalid }	        =	require('./middlewares/validationReject');
const { upload }  			    =   require('./middlewares/imageUpload');


// System Routes
router.get('/', health.loopback);
router.get('/health', health.check);

// User Routes
router.post('/login', loginValidator, checkInvalid, userController.loginUser);
router.post('/api/signup', userValidator, checkInvalid, upload, userController.createUser);
router.get('/api/users', userController.getUsers);
router.get('/api/users/:id', userController.getUserById);
router.put('/api/users/:id', userValidator, checkInvalid, upload, userController.updateUserById);

// Author Routes
router.post('/api/authors', authorValidator, checkInvalid, authorController.createAuthor);
router.get('/api/authors', authorController.getAuthors);
router.get('/api/authors/:id', authorController.getAuthorById);
router.put('/api/authors/:id', authorValidator, checkInvalid, authorController.updateAuthorById);
router.delete('/api/authors/:id', authorController.deleteAuthorById);

// Book Routes
router.post('/api/books', bookValidator, checkInvalid, bookController.createBook);
router.get('/api/books', bookController.getBooks);
router.get('/api/books/:id', bookController.getBookById);
router.put('/api/books/:id', bookValidator, checkInvalid, bookController.updateBookById);
router.delete('/api/books/:id', bookController.deleteBookById);

// Book Loan Routes
router.post('/api/books-loan', bookLoanValidator, checkInvalid, loanController.createLoan);
router.get('/api/books-loan', loanController.getLoans);
router.get('/api/books-loan/:id', loanController.getLoanById);
router.put('/api/books-loan/:id', bookLoanValidator, checkInvalid, loanController.updateLoanById);
router.delete('/api/books-loan/:id', loanController.deleteLoanById);
router.get('/api/export', loanController.exportLoan);

module.exports = router;