process.env.NODE_ENV = 'test';

const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const BookLoan = require('../models/BookLoan');
const User = require('../models/User');
const server = require('../index');
const _p = require('../helpers/simpleasync');
const bookData = require('./booksLoan.data.test');
const userData = require('./user.data.test');
const jwtCreation = require('./jwtCreation');

chai.use(chaiHttp);
let booksLoanId = null;
let token = null;

describe('BookLoan Test Suite', () => {
    before(async () => { await BookLoan.deleteMany({}) });

    describe('Testing POST /api/books-loan end point to pass', () => {
        it('should create a books Loan', async () => {
            const [jwtErr, newJwt] = await _p(jwtCreation.jwt(userData.user));
            if (jwtErr) {
                console.log(`JWT not created ${jwtErr}`);
            }

            token = newJwt;

            const [err, res] = await _p(chai.request(server)
                .post('/api/books-loan')
                .set({ token })
                .send(bookData.create));

            booksLoanId = res.body.data._id;

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
            assert.isObject(res.body.data, 'Data is object');
            assert.exists(res.body.data._id, 'MongoDB objectId exist');
        });
    });

    describe('Testing Get /api/books-loan end point to pass', () => {
        it('should return all books-loan', async () => {            
            const [err, res] = await _p(chai.request(server)
            .get(`/api/books-loan`)
            .set({ token }));

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
    		assert.isArray(res.body.data, 'Data should be an array');
    		assert.isNull(res.body.message, 'Message should be null');
        });
    });

    describe('Testing Get /api/books-loan/:id end point to pass', () => {
        it('should return a booksLoan', async () => {    
            const [err, res] = await _p(chai.request(server)
            .get(`/api/books-loan/${booksLoanId}`)
            .set({ token }));

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
    		assert.exists(res.body.data._id, 'MongoDB objectId exist');
    		assert.isObject(res.body.data, 'Data is object');
    		assert.exists(res.body.data.createdAt, 'createdAt exist');
    		assert.exists(res.body.data.updatedAt, 'updatedAt exist');
        });
    });

    describe('Testing PUT /books-loan/:id end point to pass', () => {
    	it('should update a booksLoan', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.put(`/api/books-loan/${booksLoanId}`)
    			.set({ token })
    			.send(bookData.update));
    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.exists(res.body.data._id, 'MongoDB objectId exist');
    		assert.isObject(res.body.data, 'Data is object');
    		assert.exists(res.body.data.createdAt, 'createdAt exist');
    		assert.exists(res.body.data.updatedAt, 'updatedAt exist');
    		assert.equal(res.body.data.status, 'accept', 'BookLoan status updated');
    	});
    });

    describe('Testing DELETE /books-loan/:id end point to pass', () => {
    	it('should delete a books-loan', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.delete(`/api/books-loan/${booksLoanId}`)
                .set({ token }));
                                
    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.equal(res.body.message, 'books loan deleted successfully', 'books-loan deleted successfully');
    	});
    });

    after(async () => { await BookLoan.deleteMany({}) });
});