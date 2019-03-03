const Joi = require('joi');
const express = require('express');
const router = express.Router();
const uploadService = require('./upload.service');

const response = require("../_helpers/response");

// routes
router.post('/', upload);
router.get('/all', getAll);
router.get('/:id', getById);

module.exports = router;

function upload(req, res, next) {
    const objectSchema = Joi.object({
        qs: Joi.string().min(1).required(),
        type: Joi.string().valid(['Yes-No', 'Likert scale', 'Multi choice', 'Free Text']).min(1).required(),
        values: Joi.array().when('type', { is: 'Multi choice', then: Joi.array().required()})
      }).required();

    const schema = {
        name: Joi.string().min(1).required(),
        description: Joi.string().min(3).required(),
        launchDate: Joi.string().required(),
        questions: Joi.array().items(objectSchema)    
    }
    const { error } = Joi.validate(req.body, schema);
    if(error) {
        next(error);
        return;
    }
    uploadService.upload(req, req.body)
        .then(() =>  response.prepareResponseFromMsg(res, true, false, 'survey saved', 200))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    uploadService.getAll()
        .then(uploads => response.prepareResponseFromObj(res, uploads, 'surveys'))
        .catch(err => next(err));
}

function getById(req, res, next) {
    uploadService.getById(req.params.id)
        .then(upload => upload ? response.prepareResponseFromObj(res, upload, 'surveys') : res.sendStatus(404))
        .catch(err => next(err));
}