const mongoose 		= require('mongoose');
const { Schema } 	= mongoose;
const objectID      = Schema.ObjectId;
mongoose.Promise 	= global.Promise;

const bookLoanSchema = new Schema({
	memberId: {
		type: objectID,
		ref: 'User',
		required: true
	},
	books: [{
		type: objectID,
		ref: 'Book'
	}],
	receiveDate: {
		type: Date,
	},
	returnDate: {
		type: Date,
	},
	status: { // pending, accept, reject, return
		type: String,
		lowercase: true,
		trim: true,
		default: 'pending'
	}
}, { timestamps: true });

module.exports = mongoose.model('BookLoan', bookLoanSchema);


