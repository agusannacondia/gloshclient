import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs-compat/Observable';
import { Global } from './global';

@Injectable()
export class SongService{

	public url: string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;	
	}

	testService(){
		return "Probando service";
	}

	getSongs(token, album):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'songs-by-album/' + album, {headers: headers});
	}

	addSong(token, song):Observable<any>{
		let params = JSON.stringify(song);
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.post(this.url + 'song', params, {headers: headers});
	}

}