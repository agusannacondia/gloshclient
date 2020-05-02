import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { User } from '../models/user';
import { Global } from '../services/global';

@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.html',
	providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit{
	public titulo: string;
	public userToUpdate: User;
	public identity;
	public token;
	public alertWarning = false;
	public alertSuccess = false;
	public alertMessage;
	public filesToUpload: Array<File>;
	public url: string;

	constructor(
			private _userService: UserService,
			private _uploadService: UploadService
		){
		this.titulo = "Mis datos";
		// LocalStorage
		this.identity = this._userService.getIdentity();
      	this.token = this._userService.getToken();
      	this.url = Global.url;
      	this.userToUpdate = this.identity;
	}

	ngOnInit(){

	}

	onSubmitUpdate(){

		this._userService.updateUser(this.userToUpdate).subscribe(
			response => {

				if(!response.user){
					this.alertWarning = true;
	        		this.alertSuccess = false;
	        		this.alertMessage = "El usuario no se ha actualizado";
				}else{

					localStorage.setItem('identity', JSON.stringify(this.userToUpdate));

					if(this.filesToUpload){
						this._uploadService.makeFileRequest(Global.url + "upload-image-user/" + response.user._id, [], this.filesToUpload, 'image', this.token).then((result:any)=>{
							this.userToUpdate.image = result.image;
							localStorage.setItem('identity', JSON.stringify(this.userToUpdate));

							var imagePath = this.url + 'get-image-user/' + this.userToUpdate.image;
							document.getElementById("identityImage").setAttribute('src', imagePath);
						});
					}

					document.getElementById("identityName").innerHTML = this.userToUpdate.name;
					this.alertWarning = false;
					this.alertSuccess = true;
					this.alertMessage = "El usuario se ha actualizado correctamente";
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
