import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Global } from '../services/global';
import { Album } from '../models/album';

@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService, UploadService, ArtistService, AlbumService]
})
export class AlbumAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertWarning: boolean;
	public alertSuccess: boolean;
	public alertMessage: string;
	public filesToUpload: Array<File>;

	constructor(
			private _userService: UserService,
			private _router: Router,
			private _route: ActivatedRoute,
			private _uploadService: UploadService,
			private _artistService: ArtistService,
			private _albumService: AlbumService
		){
		this.titulo = "Agregar álbum";
      	this.url = Global.url;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.album = new Album('', '', 1900, '', '', '', '');
		this.getArtist();
	}

	getArtist(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistService.getArtist(this.token, id).subscribe(
			response=>{

				if(!response.artist){
					this._router.navigate(['/']);
				}else{
					this.artist = response.artist;
					this.album.artist = this.artist._id;
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

	/*getArtists(){
			this._artistService.getAllArtists(this.token).subscribe(
			response=>{

				if(response.artists){
					this.artists = response.artists;
					console.log(this.artists);
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
	}*/

	onSubmitAdd(){

		this._albumService.addAlbum(this.token, this.album).subscribe(
			response => {

				if(!response.album){
					this.alertWarning = true;
	        		this.alertSuccess = false;
	        		this.alertMessage = "El álbum no se ha agregado";
				}else{
					
					if(this.filesToUpload){
						this._uploadService.makeFileRequest(Global.url + "upload-image-album/" + response.album._id, [], this.filesToUpload, 'image', this.token).then((result:any)=>{
							this.album.image = result.image;
						});
					}

					this.alertWarning = false;
					this.alertSuccess = true;
					this.alertMessage = "El álbum se ha agregado correctamente";
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
  	}
}
