const BookLoan = require('../models/BookLoan');
const Book = require('../models/Book');
const _p = require('../helpers/simpleasync');
const xl = require('excel4node');

//create book loan
module.exports.createLoan = async LoanInfo => {
	return new Promise(async (resolve, reject) => {
		const [error, saveLoanInfo] = await _p(BookLoan.create(LoanInfo));

		if (!error) {
			return resolve(saveLoanInfo);
		} else {
			return reject(error.message);
		}
	});
};

//get all book loans || can use query string
module.exports.getLoans = async query => {
	return new Promise(async (resolve, reject) => {
		const pageNum = query.page ? parseInt(query.page, 10) : 1;
		const Limit = query.limit ? parseInt(query.limit, 10) : 10;
		const skip = Limit * (pageNum - 1);

		if (query.page) delete query.page;
		if (query.limit) delete query.limit;

		const [error, loans] = await _p(BookLoan.find(query)
			.populate("memberId")
			.limit(Limit)
			.skip(skip)
			.sort({ createdAt: 'desc' }));

		if (!error) {
			return resolve(loans);
		} else {
			return reject(error.message);
		}
	});
};

//get book loan by loan id
module.exports.getLoanById = async id => {
	return new Promise(async (resolve, reject) => {
		const [error, loan] = await _p(BookLoan.findOne({ _id: id }).populate("memberId"));

		if (!error) {
			return resolve(loan);
		} else {
			return reject(error.message);
		}
	});
};

//update book loan by loan id
module.exports.updateLoanById = async (id, bookInfo) => {
	return new Promise(async (resolve, reject) => {
		let update_book_info = bookInfo;
		if (bookInfo.books) {
			const books = bookInfo.books;
			delete bookInfo.books;
			update_book_info = {
				...bookInfo,
				$addToSet: { books }
			}
		}

		const [error, updateLoanInfo] = await _p(BookLoan.findOneAndUpdate({ _id: id }, update_book_info, { new: true }));

		if (!error) {
			if (bookInfo.status) {
				if (bookInfo.status === 'accept') {
					updateLoanInfo.books.map(async book => {
						const [error, updateBookInfo] = await _p(Book.findOneAndUpdate({ _id: book }, { status: 'borrowed' }, { new: true }));
						if (error) return reject(error.message);
					})
				}
				if (bookInfo.status === 'return') {
					updateLoanInfo.books.map(async book => {
						const [error, updateBookInfo] = await _p(Book.findOneAndUpdate({ _id: book }, { status: 'available' }, { new: true }));
						if (error) return reject(error.message);
					})
				}
			}
			return resolve(updateLoanInfo);
		} else {
			return reject(error.message);
		}
	});
};

//delete book loan by loan id
module.exports.deleteLoanById = async id => {
	return new Promise(async (resolve, reject) => {
		const [error, deleteLoanInfo] = await _p(BookLoan.findOneAndDelete({ _id: id }));

		if (!error) {
			return resolve(deleteLoanInfo);
		} else {
			return reject(error.message);
		}
	});
};

//delete book loan by loan id
module.exports.exportLoan = async () => {
	return new Promise(async (resolve, reject) => {
		let [error, loanInfo] = await _p(BookLoan.find({})
			.populate("memberId")
			.select({ 'memberId.name': 1, receiveDate: 1, returnDate: 1, status: 1 }));
		const [err, books] = await _p(BookLoan.aggregate([
			{ $unwind: "$books" },
			{ $lookup: { from: 'books', localField: 'books', foreignField: '_id', as: 'book' } },
			{ $unwind: "$book" },
			{
				$group: {
					_id: "$_id",
					"books": { "$push": "$book.name" },
				}
			},
		]));

		if (!error && !err) {
			const wb = new xl.Workbook();
			const date = new Date;
			const fileName = date.toString().split(' ').splice(0, 4).join('-') + '-BooksLoanList';
			const ws = wb.addWorksheet(fileName);

			const headingColumnNames = [
				"Member",
				"Books",
				"Receive Date",
				"Return Date",
				"Status",
			]

			//Write Column Title in Excel file
			let headingColumnIndex = 1;
			headingColumnNames.forEach(heading => {
				ws.cell(1, headingColumnIndex++)
					.string(heading).style({
						font: { bold: true }, alignment: {
							wrapText: true,
							horizontal: 'center',
						},
					});
			});

			//Write Data in Excel file
			let rowIndex = 2;
			loanInfo.forEach(record => {
				let recordBooks = [];
				let index = books.findIndex(book => record._id === record._id);
				if (index != -1) recordBooks = books[index].books;
				
				let columnIndex = 1;
				let data = {
					member: record.memberId.name,
					books: recordBooks.join(', '),
					receiveDate: record.receiveDate.toString().split('').splice(0, 15).join(''),
					returnDate: record.returnDate.toString().split('').splice(0, 15).join(''),
					status: record.status
				}
				Object.keys(data).forEach(columnName => {
					ws.cell(rowIndex, columnIndex++)
						.string(data[columnName])
				});
				rowIndex++;
			});

			wb.write(fileName + '.xlsx', function (err, stats) {
				if (!err) {
					return resolve(stats);
				} else {
					return reject(err.message);
				}
			});
		} else {
			return reject(error.message || err.message);
		}
	});
};
