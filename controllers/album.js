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

function getAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!album){
				res.status(404).send({message:"El album no existe"});
			}else{
				res.status(200).send({album:album});
			}
		}
	});
}

function getAlbums(req, res){
	var artistId = req.params.artist;

	if(!artistId){
		var find = Album.find({}).sort('title');
	}else{
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err, albums)=>{

		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!albums){
				res.status(404).send({message:"No hay albums"});
			}else{
				return res.status(200).send({albums});
			}
		}

	});
}

function getAlbumsByTitle(){
	var title = req.params.title;

	if(!artistId){
		var find = Album.find({}).sort('title');
	}else{
		var find = Album.find({title: { $regex: '.*' + title + '.*' }});
	}

	find.populate({path: 'artist'}).exec((err, albums)=>{

		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!albums){
				res.status(404).send({message:"No hay albums"});
			}else{
				return res.status(200).send({albums});
			}
		}

	});
}

function saveAlbum(req, res){
	var album = new Album();
	var params = req.body;

	album.title = params.title;
	album.year = params.year;
	album.image = "";
	album.description = params.description;
	album.genre = params.genre;
	album.artist = params.artist;

	if(album.title != null){
		album.save((err, albumStored)=>{
			if(err){
				res.status(500).send({message:"Error al guardar el album"});
			}else{
				if(!albumStored){
					res.status(400).send({message:"No se ha registrado el album"});	
				}else{
					res.status(200).send({album:albumStored});
				}
			}
		});
	}else{
		res.status(200).send({message:"Rellena todos los campos"});
	}
}

function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{

		if(err){
			res.status(500).send({message: "Error al actualizar el album"});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: "No se ha podido actualizar el album"});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}

	});

}

function deleteAlbum(req, res){
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
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
							res.status(200).send({album: albumRemoved});
						}
					}
				});

			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var fileName = 'Imagen no subida';

	if(req.files){
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('\\');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('\.');
		var fileExt = extSplit[1];
		
		if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
			Album.findByIdAndUpdate(albumId, {image:fileName}, (err, albumUpdated)=>{
				if(err){
					res.status(500).send({message: "Error al actualizar el album"});
				}else{
					if(!albumUpdated){
						res.status(404).send({message: "No se ha podido actualizar el album"});
					}else{
						res.status(200).send({album: albumUpdated});
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
	var pathFile = './uploads/albums/'; 

	fs.exists(pathFile + imageFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile + imageFile));
		}else{
			res.status(200).send({message: "La imagen no existe"});	
		}
	});


}

module.exports = {
	getAlbum,
	getAlbums,
	getAlbumsByTitle,
	saveAlbum,
	deleteAlbum,
	updateAlbum,
	uploadImage,
	getImageFile
};