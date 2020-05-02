'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
	number: Number,
	title: String,
	duration: String,
	file: String,
	album: { type: Schema.Types.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model('Song', SongSchema);