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
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, AlbumService, SongService]
})
export class ArtistDetailComponent implements OnInit{
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertWarning: boolean;
	public alertSuccess: boolean;
	public alertMessage: string;
	public albums: Array<Album>;
	public songs: Array<Song>;
	public slideConfigSong = {"slidesToShow": 6, "slidesToScroll": 6};
	public slideConfig = {"slidesToShow": 4, "slidesToScroll": 4};

	constructor(
			private _userService: UserService,
			private _artistService: ArtistService,
			private _router: Router,
			private _route: ActivatedRoute,
			private _albumService: AlbumService,
			private _songService: SongService
		){
      	this.url = Global.url;
      	this.artist = null;
      	this.albums = null;
      	this.songs = null;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();		
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
					this.getAlbums(response.artist);
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

	getAlbums(artist){

		this._albumService.getAlbums(this.token, artist._id).subscribe(
			response=>{

				if(response.albums){
					this.albums = response.albums;
					this.getSongs(response.albums);
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

	getSongs(albums){
		this.songs = new Array<Song>();

		albums.forEach(e => {

			this._songService.getSongs(this.token, e._id).subscribe(
				response=>{
						
						if(response.songs){
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

		});
	}

	

	irAlAlbum(id){
		this._router.navigate(['/album', id]);
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
