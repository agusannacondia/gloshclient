'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var jwt = require('../services/jwt');

function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist)=>{
		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!artist){
				res.status(404).send({message:"El artista no existe"});
			}else{
				res.status(200).send({artist:artist});
			}
		}
	});
}

function getArtists(req, res){
	var page = req.params.page ? req.params.page : 1;
	var itemsPerPage = 5;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){

		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!artists){
				res.status(404).send({message:"No hay artistas"});
			}else{
				return res.status(200).send({
					totalItems: total,
					artists: artists
				});
			}
		}

	});
}

function getAllArtists(req, res){

	Artist.find().sort('name').exec(function(err, artists){

		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!artists){
				res.status(404).send({message:"No hay artistas"});
			}else{
				return res.status(200).send({
					artists: artists
				});
			}
		}

	});
}

function saveArtist(req, res){
	var artist = new Artist();
	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image = "";

	if(artist.name != null){
		artist.save((err, artistStored)=>{
			if(err){
				res.status(500).send({message:"Error al guardar el artista"});
			}else{
				if(!artistStored){
					res.status(400).send({message:"No se ha registrado el artista"});	
				}else{
					res.status(200).send({artist:artistStored});
				}
			}
		});
	}else{
		res.status(200).send({message:"Rellena todos los campos"});
	}
}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{

		if(err){
			res.status(500).send({message: "Error al actualizar el artista"});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: "No se ha podido actualizar el artista"});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}

	});

}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
		if(err){
			res.status(500).send({message: "Error al eliminar el artista"});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: "El artista no ha sido eliminado"});
			}else{



				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
					if(err){
						res.status(500).send({message: "Error al eliminar el album"});
					}else{
						if(!albumRemoved){
							res.status(404).send({message: "El album no ha sido eliminado"});
						}else{
							


							Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
								if(err){
									res.status(500).send({message: "Error al eliminar la cancion"});
								}else{
									if(!songRemoved){
										res.status(404).send({message: "La cancion no ha sido eliminada"});
									}else{
										res.status(200).send({artist: artistRemoved});
									}
								}
							});





						}
					}
				});



			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var fileName = 'Imagen no subida';

	if(req.files){
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('\\');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('\.');
		var fileExt = extSplit[1];

		//console.log(fileName + '   ' + artistId);
		
		if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image:fileName}, (err, artistUpdated)=>{
				if(err){
					res.status(500).send({message: "Error al actualizar el artista"});
				}else{
					if(!artistUpdated){
						res.status(404).send({message: "No se ha podido actualizar el artista"});
					}else{
						res.status(200).send({artist: artistUpdated});
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
	var pathFile = './uploads/artists/'; 

	fs.exists(pathFile + imageFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile + imageFile));
		}else{
			res.status(200).send({message: "La imagen no existe"});	
		}
	});


}

module.exports = {
	getArtist,
	getArtists,
	getAllArtists,
	saveArtist,
	updateArtist,
	uploadImage,
	getImageFile,
	deleteArtist
};