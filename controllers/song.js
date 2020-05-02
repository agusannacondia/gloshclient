'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
	var songId = req.params.id;

	//Song.findById(songId).populate({path:'album'}).populate({path: 'artist'}).exec((err, song)=>{
	Song.findById(songId).populate({path:'album'}).exec((err, song)=>{
		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!song){
				res.status(404).send({message:"La cancion no existe"});
			}else{
				res.status(200).send({song:song});
			}
		}
	});
}

function getSongsByAlbum(req, res){
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('title');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({path: 'album'}).exec((err, songs)=>{

		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!songs){
				res.status(404).send({message:"No hay canciones"});
			}else{
				return res.status(200).send({songs});
			}
		}

	});
}

function getSongsByTitle(req, res){
	var titleToSearch = req.params.title;

	if(!titleToSearch){
		var find = Song.find({}).sort('year');
	}else{
		var find = Song.find({title: { $regex: '.*' + titleToSearch + '.*' }});
	}

	find.populate({path: 'album'}).exec((err, songs)=>{

		if(err){
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if(!songs){
				res.status(404).send({message:"No hay canciones"});
			}else{
				return res.status(200).send({songs});
			}
		}

	});
}

function saveSong(req, res){
	var song = new Song();
	var params = req.body;
	
	song.number = params.number;
	song.title = params.title;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	if(song.title != null){
		song.save((err, songStored)=>{
			if(err){
				res.status(500).send({message:"Error al guardar la cancion"});
			}else{
				if(!songStored){
					res.status(400).send({message:"No se ha registrado la cancion"});	
				}else{
					res.status(200).send({song:songStored});
				}
			}
		});
	}else{
		res.status(200).send({message:"Rellena todos los campos"});
	}
}


function deleteSong(req, res){
	var songId = req.params.id;
		
	Song.findByIdAmdRemove(songId, (err, songRemoved)=>{
		if(err){
			res.status(500).send({message: "Error al eliminar la cancion"});
		}else{
			if(!songRemoved){
				res.status(404).send({message: "La cancion no ha sido eliminada"});
			}else{
				res.status(200).send({songRemoved});
			}
		}
	});

}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{

		if(err){
			res.status(500).send({message: "Error al actualizar la cancion"});
		}else{
			if(!songUpdated){
				res.status(404).send({message: "No se ha podido actualizar la cancion"});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}

	});

}

function uploadFile(req, res){
	var songId = req.params.id;
	var fileName = 'Archivo no subido';

	if(req.files){
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('\\');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('\.');
		var fileExt = extSplit[1];
		
		if (fileExt == 'mp3' || fileExt == 'ogg'){
			Song.findByIdAndUpdate(songId, {file:fileName}, (err, songUpdated)=>{
				if(err){
					res.status(500).send({message: "Error al actualizar la cancion"});
				}else{
					if(!songUpdated){
						res.status(404).send({message: "No se ha podido actualizar la cancion"});
					}else{
						res.status(200).send({song: songUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message: "La extension del archivo no es valida"});
		}
	}else{
		res.status(200).send({message: "No se ha subido ningun archivo"});
	}
}

function getFile(req, res){	
	var songFile = req.params.songFile;
	var pathFile = './uploads/songs/'; 

	fs.exists(pathFile + songFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile + songFile));
		}else{
			res.status(200).send({message: "El archivo no existe"});	
		}
	});


}


module.exports = {
	getSong,
	getSongsByTitle,
	getSongsByAlbum,
	saveSong,
	deleteSong,
	updateSong,
	uploadFile,
	getFile
};