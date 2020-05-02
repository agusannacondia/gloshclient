'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: { type: String, required: true, unique: true},
	password: String,
	role: String,
	image: String,
	playlists: [{ type: Schema.ObjectId, ref: 'Song' }]
});

module.exports = mongoose.model('User', UserSchema);