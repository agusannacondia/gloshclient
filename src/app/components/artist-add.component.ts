import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Global } from '../services/global';


@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, UploadService, ArtistService]
})
export class ArtistAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertWarning: boolean;
	public alertSuccess: boolean;
	public alertMessage: string;
	public filesToUpload: Array<File>;

	constructor(
			private _userService: UserService,
			private _uploadService: UploadService,
			private _artistService: ArtistService
		){
		this.titulo = "Agregar artista";
      	this.url = Global.url;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.artist = new Artist('', '', '', '');
	}

	onSubmitAdd(){

		this._artistService.addArtist(this.token, this.artist).subscribe(
			response => {

				if(!response.artist){
					this.alertWarning = true;
	        		this.alertSuccess = false;
	        		this.alertMessage = "El artista no se ha agregado";
				}else{
					
					if(this.filesToUpload){
						this._uploadService.makeFileRequest(Global.url + "upload-image-artist/" + response.artist._id, [], this.filesToUpload, 'image', this.token).then((result:any)=>{
							this.artist.image = result.image;
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

	fileChangeEvent(fileInput: any){
  		this.filesToUpload = <Array<File>>fileInput.target.files;
  	}
}
