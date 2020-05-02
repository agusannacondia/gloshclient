import { Injectable } from '@angular/core';
import { Global } from './global';


@Injectable()
export class UploadService{

	public url: string;

	constructor(
	){
		this.url = Global.url;
	}

	makeFileRequest(
			url:string,
			params: Array<string>,
			files: Array<File>,
			name: string,
			token: string
		){
		return new Promise(function(resolve, reject){
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest();

			console.log(files);

			for (var i = 0; i < files.length; i++){
				formData.append('image', files[i], files[i].name);
			}

			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4){
					if (xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}

			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);

		});
	}	
}