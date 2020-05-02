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
	selector: 'song-add-multiple',
	templateUrl: '../views/song-add-multiple.html',
	providers: [UserService, UploadService, ArtistService, AlbumService, SongService]
})
export class SongAddMultipleComponent implements OnInit{
	public titulo: string;
	public artistaPorDefecto: Artist;
	public todosLosAlbums: Array<Album>;
	public identity;
	public token;
	public songs: Array<Song>;
	public url: string;
	public alertWarning: boolean;
	public alertSuccess: boolean;
	public alertMessage: string;
	public filesToUpload: Array<File>;
	public albumSeleccionado: string;

	constructor(
			private _userService: UserService,
			private _router: Router,
			private _route: ActivatedRoute,
			private _uploadService: UploadService,
			private _artistService: ArtistService,
			private _albumService: AlbumService,
			private _songService: SongService
		){		
		this.titulo = "Agregar multiples canciones";
      	this.url = Global.url;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.getArtist();
	}

	getArtist(){

		var id;

		this._route.params.forEach((params: Params) => {
			id = params['id'];
		});

		this._artistService.getArtist(this.token, id).subscribe(
		response=>{

			if(!response){
				this.alertWarning = true;
        		this.alertSuccess = false;
	        	this.alertMessage = "Error";
			}else{
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
		
	}

	getAlbums(){

			this._albumService.getAlbums(this.token, this.artistaPorDefecto._id).subscribe(
			response=>{

				if(!response){
					this.alertWarning = true;
	        		this.alertSuccess = false;
		        	this.alertMessage = "Error";
				}else{
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

	fileChangeEvent(fileInput: any){
  		this.filesToUpload = <Array<File>>fileInput.target.files;
  		this.cargarTablas();
  		console.log(this.filesToUpload);
  	}

  	cargarTablas(){

  		var idAlbum;
  		this.todosLosAlbums.forEach(a=>{
  			if (a.title == this.albumSeleccionado && a.title != "")
  			{
  				idAlbum = a._id;
  			}
		});

  		this.songs = new Array<Song>();
  		
  		var i = 1;
  		for(var file of this.filesToUpload){
  			let newSong = new Song("", 0, "", "", "", "");
  			newSong.album =	idAlbum;
  			if(file.name.split("-").length > 1){
  				newSong.title = file.name.split(".")[0].split("-")[1];
  			}else{
  				newSong.title = file.name.split(".")[0];
  			}
  			newSong.number = i++;
  			console.log(file.name);
  			newSong.file = file.name;
  			newSong.duration = '3:45';
  			this.songs.push(newSong);
  		}
  	}

  	agregarCanciones(){

  		/*for(var i=0;i<this.songs.length;i++){

  			this._songService.addSong(this.token, this.songs[i]).subscribe(
			response => {

				if(!response.song){
					this.alertWarning = true;
	        		this.alertSuccess = false;
	        		this.alertMessage = "La cancion no se ha agregado";
				}else{

					if(this.filesToUpload){
						var array = new FileList();
						array[0] = (this.filesToUpload[0]);
						this.filesToUpload.splice(0, 1);
						this._uploadService.makeFileRequest(Global.url + "upload-song-file/" + response.song._id, [], array, 'files', this.token).then((result:any)=>{
							this.songs[i].file = result.file;
						});
						console.log("Todo OK");
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
		*/

  	}
}
