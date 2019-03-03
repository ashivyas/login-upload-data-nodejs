const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qsSchema = new Schema({
    qs: { type: String, required: true },
    type: { type: String, enum: ['Yes-No', 'Likert scale', 'Multi choice', 'Free Text']},
    values: { type: Array }
});

const surveySchema = new Schema({
    name: { type: String, required: true },
    user: { type: String, required: true},
    description: { type: String, required: true},
    questions : [qsSchema],
    launchDate: { type: Date, required: true},
    createdDate: { type: Date, default: Date.now},
});

surveySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Upload', surveySchema);