'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "cl4v3s3cr3t4";

exports.ensureAuth = function(req, res, next){

	if(!req.headers.authorization){
		return res.status(403).send({message:"La peticion no tiene la cabecera de autenticacion"});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment().unix()){
			return res.status(401).send({message:"La sesion ha expirado"});
		}
	}catch(ex){
		return res.status(404).send({message:"Token no valido"});
	}

	req.user = payload;

	next();
};