const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const wordSchema = new Schema({
    word : { type : String, required : true},
    wordname : { type : String , required : true},
    worddvcd : { type : String , required : false},
    wordlevel : { type : Number },
    inputname : { type : String },
    inputdate : { type : Date },
    note : { type : String}
});

module.exports = mongoose.model('Word', wordSchema);