import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs-compat/Observable';
import { Global } from './global';

@Injectable()
export class AlbumService{

	public url: string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;	
	}

	testService(){
		return "Probando service";
	}

	getAlbum(token, id):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'album/' + id, {headers: headers});
	}

	getAlbums(token, artist):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'albums/' + artist, {headers: headers});
	}

	addAlbum(token, album):Observable<any>{
		let params = JSON.stringify(album);
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.post(this.url + 'album', params, {headers: headers});
	}
}