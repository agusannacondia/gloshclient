import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Global } from '../services/global';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, ArtistService, AlbumService, SongService]
})
export class AlbumDetailComponent implements OnInit{
	public identity;
	public token;
	public url: string;
	public alertWarning: boolean;
	public alertSuccess: boolean;
	public alertMessage: string;
	public album: Album;
	public songs: Array<Song>;
	public artist: Artist;

	constructor(
			private _userService: UserService,
			private _artistService: ArtistService,
			private _router: Router,
			private _route: ActivatedRoute,
			private _albumService: AlbumService,
			private _songService: SongService
		){
      	this.url = Global.url;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.getAlbum();
	}

	getAlbum(){

		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
			response=>{

				if(response.album){
					this.album = response.album;
					this.artist = response.album.artist;
					this.getSongs();
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

	getSongs(){

			this._songService.getSongs(this.token, this.album._id).subscribe(
				response=>{

						if(response.songs){
							this.songs = new Array<Song>();
							response.songs.forEach(a => {
								this.songs.push(a);
							});
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

	startPlayer(song){

		let songPlayer = JSON.stringify(song);
		let filePath = this.url + 'get-song/' + song.file;
		let imagePath = this.url + 'get-image-album/' + song.album.image;

		localStorage.setItem('soundSong', songPlayer);

		console.log(song);

		document.getElementById("moduloPlayer").hidden = false;
		document.getElementById("mp3-source").setAttribute("src", filePath);
		document.getElementById("player-title").innerHTML = song.title;
		document.getElementById("player-image").setAttribute("src", imagePath);
		//document.getElementById("player-artist").innerHTML = song.album.artist.name;
		document.getElementById("player-artist").innerHTML = "Attaque 77";
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

	}

}
