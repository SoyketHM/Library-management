process.env.NODE_ENV = 'test';

const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Book = require('../models/Book');
const server = require('../index');
const _p = require('../helpers/simpleasync');
const bookData = require('./book.data.test');
const userData = require('./user.data.test');
const jwtCreation = require('./jwtCreation');

chai.use(chaiHttp);
let bookId = null;
let token = null;

describe('Book Test Suite', () => {
    before(async () => { await Book.deleteMany({}) });

    describe('Testing POST /api/books end point to pass', () => {
        it('should create a book', async () => {
            const [jwtErr, newJwt] = await _p(jwtCreation.jwt(userData.user));
            if (jwtErr) {
                console.log(`JWT not created ${jwtErr}`);
            }

            token = newJwt;

            const [err, res] = await _p(chai.request(server)
                .post('/api/books')
                .set({ token })
                .send(bookData.create));

            bookId = res.body.data._id;

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
            assert.isObject(res.body.data, 'Data is object');
            assert.exists(res.body.data._id, 'MongoDB objectId exist');
        });
    });

    describe('Testing Get /api/books end point to pass', () => {
        it('should return all books', async () => {            
            const [err, res] = await _p(chai.request(server)
            .get(`/api/books`)
            .set({ token }));

            assert.equal(res.status, 200, 'Http response code is 200');
            assert.isNull(err, 'Promise error is null');
            assert.isFalse(res.body.error, 'Error is false');
    		assert.isArray(res.body.data, 'Data should be an array');
    		assert.isNull(res.body.message, 'Message should be null');
        });
    });

    describe('Testing Get /api/books/:id end point to pass', () => {
        it('should return a book', async () => {    
            const [err, res] = await _p(chai.request(server)
            .get(`/api/books/${bookId}`)
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

    describe('Testing PUT /books/:id end point to pass', () => {
    	it('should update a book', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.put(`/api/books/${bookId}`)
    			.set({ token })
    			.send(bookData.update));
    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.exists(res.body.data._id, 'MongoDB objectId exist');
    		assert.isObject(res.body.data, 'Data is object');
    		assert.exists(res.body.data.createdAt, 'createdAt exist');
    		assert.exists(res.body.data.updatedAt, 'updatedAt exist');
    		assert.equal(res.body.data.name, 'The Knight', 'Book name updated');
    		assert.equal(res.body.data.genre, 'Si-Fi', 'Book gener updated');
    	});
    });

    describe('Testing DELETE /books/:id end point to pass', () => {
    	it('should delete a books', async () => {
    		const [err, res] = await _p(chai.request(server)
    			.delete(`/api/books/${bookId}`)
                .set({ token }));

    		assert.equal(res.status, 200, 'Http response code is 200');
    		assert.isNull(err, 'Promise error is null');
    		assert.isFalse(res.body.error, 'Error is false');
    		assert.equal(res.body.message, 'book deleted successfully', 'books deleted successfully');
    	});
    });

    after(async () => { await Book.deleteMany({}) });
});