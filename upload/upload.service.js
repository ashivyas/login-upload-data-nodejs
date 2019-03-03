const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Upload = db.Upload;

module.exports = {
    upload,
    getAll,
    getById
};


async function getAll() {
    return await Upload.find().select();
}

async function getById(id) {
    return await Upload.findById(id).select();
}

async function upload(req, qsParam) {
    qsParam.user = req.user.sub; 
    const uploadNow = new Upload(qsParam);
    console.log(uploadNow);
    await uploadNow.save(function (err) {
        if (!err) {
            console.log('Success!');
        }
        else console.log(err);
      });
}
