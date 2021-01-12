const Author 	= require('../models/Author');
const Book 	= require('../models/Book');
const _p    = require('../helpers/simpleasync');

//create author
module.exports.createAuthor = async authorInfo => { 
	return new Promise(async (resolve, reject) => {
		const [error, saveAuthorInfo] = await _p(Author.create(authorInfo));

		if (!error) {
			return resolve(saveAuthorInfo);
		} else {
			return reject(error.message);
		}
	});
};

//get all authors || can use query string
module.exports.getAuthors = async query => {
	return new Promise(async (resolve, reject) => {
		const pageNum = query.page ? parseInt(query.page, 10) : 1;
        const Limit = query.limit ? parseInt(query.limit, 10) : 10;
        const skip = Limit * (pageNum - 1);

        if (query.page) delete query.page;
        if (query.limit) delete query.limit;

		const [error, authors] = await _p(Author.find( query )
			.limit(Limit)
			.skip(skip)
			.sort({createdAt: 'desc'}));

		if(!error) {
			return resolve(authors);
		} else {
			return reject(error.message);
		}
	});
};

//get author by author id
module.exports.getAuthorById = async id => {
	return new Promise(async (resolve, reject) => {
		const [error, author] = await _p(Author.findOne({ _id: id }));

		if(!error) {
			return resolve(author);
		} else {
			return reject(error.message);
		}
	});
};

//update author by author id
module.exports.updateAuthorById = async (id, authorInfo) => {
	return new Promise(async (resolve, reject) => {
		const [error, updateAuthorInfo] = await _p(Author.findOneAndUpdate({ _id: id }, authorInfo, { new: true	}));

		if (!error) {
			return resolve(updateAuthorInfo);
		} else {
			return reject(error.message);
		}
	});
};

//delete author by author id
module.exports.deleteAuthorById = async id => {
	return new Promise(async (resolve, reject) => {
		const [error, deleteAuthorInfo] = await _p(Author.findOneAndDelete({ _id: id }));
		const [err, deleteBookInfo] = await _p(Book.deleteMany({ author: id }));

		if (!error && !err) {
			return resolve(deleteAuthorInfo, deleteBookInfo);
		} else {
			return reject(error.message);
		}
	});
};
