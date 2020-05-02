import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs-compat/Observable';
import { Global } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService{

	public url: string;
	public identity;
	public token;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;	
	}

	testService(){
		return "Probando service";
	}

	signIn(userToLogin: User, getHash: boolean): Observable<any>{

		var user = new User('', '', '', userToLogin.email, userToLogin.password, userToLogin.role, userToLogin.image, '', null);

		if(getHash == true){
			user.getHash = true;
		}

		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url + 'login', params, {headers: headers});
	}

	sendConfirmationEmail(email): Observable<any>{
		let params = JSON.stringify(email);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url + 'enviar-confirmacion', params, {headers: headers});
	}

	signUp(userToRegister: User): Observable<any>{
		let params = JSON.stringify(userToRegister);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url + 'register', params, {headers: headers});
	}

	resetPassword(id): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url + 'project/' + id, {headers: headers});
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return identity;
	}

	getToken(){
		let token = JSON.parse(localStorage.getItem('token'));

		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}

		return token;
	}

	updateUser(userToUpdate):Observable<any>{
		let params = JSON.stringify(userToUpdate);
		let headers = new HttpHeaders({'Content-Type': 'application/json',
										'Authorization': this.getToken()});

		return this._http.put(this.url + 'update-user/' + userToUpdate._id, params, {headers: headers});
	}

	getClima(cp):Observable<any>{		

		return this._http.get("http://api.openweathermap.org/data/2.5/weather?zip=" + cp + ",ar&appid=05980f47601d51205b16b54d011e9fdb");
	}

}