'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'}); 

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs-by-album/:album?', md_auth.ensureAuth, SongController.getSongsByAlbum);
api.get('/songs-by-title/:title?', md_auth.ensureAuth, SongController.getSongsByTitle);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.delete('/song', md_auth.ensureAuth, SongController.deleteSong);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.post('/upload-song-file/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song/:songFile', SongController.getFile);

module.exports = api;