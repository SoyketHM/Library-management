const userCrud = require('../services/userCrud');
const _p = require('../helpers/simpleasync');
const hash = require('../helpers/password_hash');
const { createResponse } = require('../utils/responseGenerate');
const jwt = require('../helpers/jwt');

/**
 * @swagger
 *
 * definitions:
 *   LoginUser:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         example: admin@gmail.com
 *       password:
 *         type: string
 *         format: password
 *         example: admin
 *   User:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       name:
 *         type: string
 *         example: Jone
 *       email:
 *         type: string
 *         example: jone@gmail.com
 *       password:
 *         type: string
 *         format: password
 *         example: 12345
 *       type:
 *         type: string
 *         example: librarian/member
 *       photo:
 *         type: string
 *         example: image.jpg
 *       status:
 *         type: string
 *         example: active
 */

/**
 * @swagger
 *
 * /api/signup:
 *   post:
 *     tags: [signup]
 *     description: Create a new user
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: name
 *         description: User name
 *         in:  formData
 *         type: string
 *       - name: email
 *         description: User email
 *         in:  formData
 *         type: string
 *       - name: password
 *         description: User password
 *         in:  formData
 *         type: string
 *       - name: type
 *         description: User type
 *         in:  formData
 *         type: date
 *       - name: photo
 *         description: User photo
 *         in:  formData
 *         type: file
 *       - name: status
 *         description: User status
 *         in:  formData
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *               "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmVsYXlldCIsInR5cGUiOiJhZG1pbiIsInN0YXR1cyI6ImFjdGl2ZSIsImV4cCI6MTYwNzUyMDgxMzIsImlhdCI6MTYwNzUyMDQ1M30.SvDzXJihv0j8t_5NFAZou77TywA3Kuf3NV9YpEwqeVg",
 *               "name": "Belayet"
 *               },
 *               "message": "user created successfully"
 *             } 
 *         
 */
module.exports.createUser = async (req, res, next) => {
    if(req.file) req.body.photo = `/uploads/${req.file.filename}`;
    
    if (req.body.password) {
        const hashPass = await hash.new(req.body.password);
        req.body.password = hashPass;
    }
    const [error, user] = await _p(userCrud.createUser(req.body));

    if (error) {
        console.log(error);
        return next(new Error('user creation failed'));
    }
    let token = '';
    if (user) {
        const payload = {
            id: user.userId,
            name: user.name,
            type: user.type,
            status: user.status,
            exp: Math.floor(Date.now() / 100) + (60 * 60)
        };
        token = await jwt.encode(payload);
    }

    return res.status(200).json(createResponse({ token, name: user.name, id: user._id }, 'user created successfully'));
};

/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     tags: [users]
 *     description: Get all users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *     responses:
 *       200:
 *         description: OK
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": [{
 *                   "type": "librarian",
 *                   "status": "active",
 *                   "_id": "5fd0d0c55bc98643cc739c47",
 *                   "name": "Belayet",
 *                   "email": "belayet2@gmail.com",
 *                   "photo": "photo-1610471291448.png",
 *                   "createdAt": "2020-12-09T13:27:33.186Z",
 *                   "updatedAt": "2020-12-09T13:27:33.186Z",
 *                   "__v": 0
 *               },
 *               {
 *                   "type": "member",
 *                   "status": "active",
 *                   "_id": "5fd09bf4cb566038a86609cb",
 *                   "name": "Akash",
 *                   "email": "akash@gmail.com",
 *                   "photo": "photo-1610471291448.png",
 *                   "createdAt": "2020-12-09T13:27:33.186Z",
 *                   "updatedAt": "2020-12-09T13:27:33.186Z",
 *                   "__v": 0
 *               }],
 *               "message": null
 *             } 
 *         
 */
module.exports.getUsers = async (req, res, next) => {
    const [error, users] = await _p(userCrud.getUsers(req.query));

    if (error) {
        console.log(error);
        return next(new Error('user fetch error'));
    }
    return res.status(200).json(createResponse(users));
};

/**
 * @swagger
 *
 * /api/users/{id}:
 *   get:
 *     tags: [users]
 *     description: User get by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: User id
 *         in:  path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *                   "type": "librarian",
 *                   "status": "active",
 *                   "_id": "5fd0d0c55bc98643cc739c47",
 *                   "name": "Belayet",
 *                   "email": "belayet2@gmail.com",
 *                   "photo": "photo-1610471291448.png",
 *                   "createdAt": "2020-12-09T13:27:33.186Z",
 *                   "updatedAt": "2020-12-09T13:27:33.186Z",
 *                   "__v": 0
 *               },
 *               "message": null
 *             } 
 *         
 */
module.exports.getUserById = async (req, res, next) => {
    const [error, user] = await _p(userCrud.getUserById(req.params.id));

    if (error) {
        console.log(error);
        return next(new Error('user fetch error'));
    }

    if (!user) {
        return res.status(200).json(createResponse(null, 'user not found'));
    }
    return res.status(200).json(createResponse(user));
};

/**
 * @swagger
 *
 * /api/users/{id}:
 *   put:
 *     tags: [users]
 *     description: Update user by id 
 *     parameters:
 *       - name: token
 *         description: User token
 *         in:  header
 *       - name: id
 *         description: User id
 *         in:  path
 *         type: string
 *       - name: name
 *         description: User name
 *         in:  formData
 *         type: string
 *       - name: email
 *         description: User email
 *         in:  formData
 *         type: string
 *       - name: password
 *         description: User password
 *         in:  formData
 *         type: string
 *       - name: type
 *         description: User type
 *         in:  formData
 *         type: date
 *       - name: photo
 *         description: User photo
 *         in:  formData
 *         type: file
 *       - name: status
 *         description: User status
 *         in:  formData
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *                   "type": "member",
 *                   "status": "inactive",
 *                   "_id": "5fd0d0c55bc98643cc739c47",
 *                   "name": "Belayet",
 *                   "email": "belayet2@gmail.com",
 *                   "photo": "photo-1610471291448.png",
 *                   "createdAt": "2020-12-09T13:27:33.186Z",
 *                   "updatedAt": "2020-12-09T13:27:33.186Z",
 *                   "__v": 0
 *               },
 *               "message": "user updated successfully"
 *             } 
 *         
 */
module.exports.updateUserById = async (req, res, next) => {
    if(req.file) req.body.photo = req.file.filename;
    let [error, user] = await _p(userCrud.updateUserById(req.params.id, req.body));

    if (error) {
        console.log(error);
        return next(new Error('user access error'));
    }
    if (!user) {
        return res.status(200).json(createResponse(null, 'user not found'));
    }
    return res.status(200).json(createResponse(user, 'user updated successfully'));
};

/**
 * @swagger
 * 
 *  /login:
 *    post:
 *     tags: [login]
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: user
 *       schema:
 *         $ref: '#/definitions/LoginUser'
 *     responses:
 *       200:
 *         description: OK
 *         examples: 
 *           application/json: 
 *             { 
 *               "error": false,
 *               "data": {
 *               "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmVsYXlldCIsInR5cGUiOiJhZG1pbiIsInN0YXR1cyI6ImFjdGl2ZSIsImV4cCI6MTYwNzUyMDgxMzIsImlhdCI6MTYwNzUyMDQ1M30.SvDzXJihv0j8t_5NFAZou77TywA3Kuf3NV9YpEwqeVg",
 *               "name": "Belayet"
 *               },
 *               "message": "user login successfully"
 *             } 
 *         
 */
module.exports.loginUser = async (req, res, next) => {
    const [error, user] = await _p(userCrud.loginUser(req.body));
    if (!user) {
        return res.status(400).json(createResponse(null, 'user unauthorized!'));
    }
    if (user) {
        const varifyPass = await hash.verify(req.body.password, user.password);
        if (!varifyPass) {
            return res.status(500).json(createResponse(null, 'user info invalid!', true));
        }
    }

    if (error) {
        return next(new Error('user info invalid!'));
    }

    let token = '';
    if (user) {
        const payload = {
            id: user._id,
            type: user.type,
            status: user.status,
            exp: Math.floor(Date.now() / 100) + (60 * 60)
        };
        token = await jwt.encode(payload);
    }

    return res.status(200).json(createResponse({ token, name: user.name }, 'user login successfully'));
};
