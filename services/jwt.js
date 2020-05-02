'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "cl4v3s3cr3t4";

exports.createToken = function(user){

	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		username: user.username,
		role: user.role,
		image: user.image,
		playlists: user.playlists,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix()
	};

	return jwt.encode(payload, secret);
};