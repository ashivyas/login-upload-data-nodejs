const Joi = require('joi');
const express = require('express');
const router = express.Router();
const userService = require('./user.service');

const response = require("../_helpers/response");

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    const schema = {
        email: Joi.string().min(5).required(),
        password: Joi.string().min(3).required()
    }
    const { error } = Joi.validate(req.body, schema);
    if(error) {
        next(error);
        return;
    }
    userService.authenticate(req.body)
        .then(user => user ? response.prepareResponseFromObj(res, user, 'users') : response.prepareResponseFromMsg(res, true, true, 'Username or password is incorrect', 400))
        .catch(err => next(err));
}


function register(req, res, next) {
    const schema = {
        email: Joi.string().min(5).required()
    }
    const { error } = Joi.validate(req.body, schema);
    if(error) {
        next(error);
        return;
    }
    userService.create(req.body)
        .then(() => response.prepareResponseFromMsg(res, true, false, 'user registered, check your inbox', 200))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => response.prepareResponseFromObj(res, users, 'users'))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? response.prepareResponseFromObj(res, user, 'user') : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? response.prepareResponseFromObj(res, user, 'user') : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => response.prepareResponseFromMsg(res, true, false, 'user updated', 200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => response.prepareResponseFromMsg(res, true, false, 'user deleted', 200))
        .catch(err => next(err));
}