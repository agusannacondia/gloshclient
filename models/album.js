'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	year: Number,
	image: String,
	description: String,
	genre: String,
	artist: { type: Schema.Types.ObjectId, ref: 'Artist' }
});

module.exports = mongoose.model('Album', AlbumSchema);