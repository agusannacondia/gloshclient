import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs-compat/Observable';
import { Global } from './global';

@Injectable()
export class ArtistService{

	public url: string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;	
	}

	testService(){
		return "Probando service";
	}

	addArtist(token, artist):Observable<any>{
		let params = JSON.stringify(artist);
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.post(this.url + 'artist', params, {headers: headers});
	}

	updateArtist(token, artist):Observable<any>{
		let params = JSON.stringify(artist);
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.put(this.url + 'update-artist/' + artist._id, params, {headers: headers});
	}

	getArtists(token, page):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'artists/' + page, {headers: headers});
	}

	getAllArtists(token):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'all-artists', {headers: headers});
	}

	getArtist(token, id):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'artist/' + id, {headers: headers});
	}

	deleteArtist(token, id):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.delete(this.url + 'artist/' + id, {headers: headers});
	}

	getAlbums(token, id):Observable<any>{
		let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

		return this._http.get(this.url + 'albums/' + id, {headers: headers});
	}

}