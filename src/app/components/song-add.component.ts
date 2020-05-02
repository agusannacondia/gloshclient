import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Global } from '../services/global';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService, UploadService, ArtistService, AlbumService, SongService]
})
export class SongAddComponent implements OnInit{
	public titulo: string;
	public artistaPorDefecto: Artist;
	public todosLosAlbums: Array<Album>;
	public identity;
	public token;
	public song: Song;
	public url: string;
	public alertWarning: boolean;
	public alertSuccess: boolean;
	public alertMessage: string;
	public filesToUpload: Array<File>;
	public albumSeleccionado: string;

	// Modal
	public albumACrear: Album;

	constructor(
			private _userService: UserService,
			private _router: Router,
			private _route: ActivatedRoute,
			private _uploadService: UploadService,
			private _artistService: ArtistService,
			private _albumService: AlbumService,
			private _songService: SongService
		){		
		this.titulo = "Agregar canción";
      	this.url = Global.url;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.song = new Song("", 0, '', '', '', '');
		this.albumACrear = new Album("", "", 1900, "", "", "", "");
		this.getArtist();
	}

	getArtist(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistService.getArtist(this.token, id).subscribe(
			response=>{

				if(response.artist){
					this.artistaPorDefecto = response.artist;
					this.getAlbums();
				}
			},
			error=>{
				var errorMessage = <any>error;
		    	if(errorMessage != null){
		    		this.alertWarning = true;
	        		this.alertSuccess = false;
		        	this.alertMessage = error.error.message;
		    	}
			});
		});
	}

	getAlbums(){

			this._albumService.getAlbums(this.token, this.artistaPorDefecto._id).subscribe(
			response=>{

				if(response.albums){
					this.todosLosAlbums = response.albums;
				}
			},
			error=>{
				var errorMessage = <any>error;
		    	if(errorMessage != null){
		    		this.alertWarning = true;
	        		this.alertSuccess = false;
		        	this.alertMessage = error.error.message;
		    	}
			});
	}

	onSubmitAdd(){

		this.todosLosAlbums.forEach(a=>{
  			if (a.title == this.albumSeleccionado && a.title != "")
  			{
  				this.song.album = a._id;
  			}
		});

		this._songService.addSong(this.token, this.song).subscribe(
			response => {

				if(!response.song){
					this.alertWarning = true;
	        		this.alertSuccess = false;
	        		this.alertMessage = "La cancion no se ha agregado";
				}else{

					console.log("Todo OK");

					if(this.filesToUpload){
						this._uploadService.makeFileRequest(Global.url + "upload-song-file/" + response.song._id, [], this.filesToUpload, 'files', this.token).then((result:any)=>{
							this.song.file = result.file;
						});
					}

					this.alertWarning = false;
					this.alertSuccess = true;
					this.alertMessage = "La cancion se ha agregado correctamente";
				}

			},
			error=>{
		    	var errorMessage = <any>error;
		    	if(errorMessage != null){
		    		this.alertWarning = true;
	        		this.alertSuccess = false;
		        	this.alertMessage = error.error.message;
		    	}
          	}
		);
	}

	fileChangeEvent(fileInput: any){
  		this.filesToUpload = <Array<File>>fileInput.target.files;
  		console.log(this.filesToUpload);
  		console.log(this.filesToUpload[0]);
  	}














  	/* Metodos de la modal agregar album */
  	
  	onSubmitAddAlbum(){

		this._albumService.addAlbum(this.token, this.albumACrear).subscribe(
			response => {

				if(!response.album){
					this.alertWarning = true;
	        		this.alertSuccess = false;
	        		this.alertMessage = "El album no se ha agregado";
				}else{
					
					if(this.filesToUpload){
						this._uploadService.makeFileRequest(Global.url + "upload-image-album/" + response.album._id, [], this.filesToUpload, 'image', this.token).then((result:any)=>{
							this.albumACrear.image = result.image;
						});
					}

					this.alertWarning = false;
					this.alertSuccess = true;
					this.alertMessage = "El artista se ha agregado correctamente";
				}

			},
			error=>{
		    	var errorMessage = <any>error;
		    	if(errorMessage != null){
		    		this.alertWarning = true;
	        		this.alertSuccess = false;
		        	this.alertMessage = error.error.message;
		    	}
          	}
		);
	}


}
