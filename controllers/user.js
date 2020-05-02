'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Song = require('../models/song');
var jwt = require('../services/jwt');

function saveUser(req, res){
	var user = new User();

	var params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = "ROLE_USER";
	user.image = "";
	user.playlists = null;

	if(params.password){
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				user.save((err, userStored)=>{
					if(err){
						console.log(err);
						res.status(500).send({message:"Ya existe un usuario registrado con esos datos"});
					}else{
						if(!userStored){
							res.status(400).send({message:"No se ha registrado el usuario"});	
						}else{
							res.status(200).send({user:userStored});
						}
					}
				});
			}else{
				res.status(200).send({message:"Rellena todos los campos"});
			}
		});
	}
	else{
		res.status(200).send({message:"Introduce la contraseña"});
	}
}

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err,user)=> {
		if (err){
			res.status(500).send({message: "Error en la peticion"});
		}else{
			if(!user){
				res.status(404).send({message: "El correo y/o la contraseña no coinciden con nuestros registros."});
			}else{
				//Comprobar password
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//Devolver datos del usuario logueado
						if(params.getHash){
							//Devolver un token de JWT
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}
						else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: "El correo y/o la contraseña no coinciden con nuestros registros."});
					}
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub){
		res.status(500).send({message: "No tienes permiso para actualizar el usuario"});
	}else{
		User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{

			if(err){
				res.status(500).send({message: "Error al actualizar el usuario"});
			}else{
				if(!userUpdated){
					res.status(404).send({message: "No se ha podido actualizar el usuario"});
				}else{
					res.status(200).send({user: userUpdated});
				}
			}

		});
	}

}

function uploadImage(req, res){
	var userId = req.params.id;
	var fileName = 'Imagen no subida';

	if(req.files){
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('\\');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('\.');
		var fileExt = extSplit[1].toLowerCase();
		
		if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
			User.findByIdAndUpdate(userId, {image:fileName}, (err, userUpdated)=>{
				if(err){
					res.status(500).send({message: "Error al actualizar el usuario"});
				}else{
					if(!userUpdated){
						res.status(404).send({message: "No se ha podido actualizar el usuario"});
					}else{
						res.status(200).send({image: fileName, user: userUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message: "La extension del archivo no es valida"});
		}
	}else{
		res.status(200).send({message: "No se ha subido ninguna imagen"});
	}
}

function getImageFile(req, res){	
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/users/'; 

	fs.exists(pathFile + imageFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile + imageFile));
		}else{
			res.status(200).send({message: "La imagen no existe"});	
		}
	});


}

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};