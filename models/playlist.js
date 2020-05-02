'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaylistSchema = Schema({
	title: String,
	songs: [{ type: Schema.ObjectId, ref: 'Song' }]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);