import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Global } from '../services/global';


@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-list.html',
	providers: [UserService, ArtistService]
})
export class ArtistListComponent implements OnInit{
	public titulo: string;
	public artists: Artist[];
	public identity;
	public token;
	public url: string;
	public nextPage = 1;
	public prevPage = 1;

	constructor(
			private _userService: UserService,
			private _router: Router,
			private _route: ActivatedRoute,
			private _artistService: ArtistService
		){
		this.titulo = "Artistas";
		// LocalStorage
		
      	this.url = Global.url;
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.getArtists();
		// Conseguir el listado de artistas
	}

	getArtists(){
		this._route.params.forEach((params: Params) => {
			
			let page = +params['page'];
			if(!page){
				page = 1;
			}
			else{
				this.nextPage = page + 1;
				this.prevPage = page - 1;

				if (this.prevPage == 0){
					this.prevPage = 1;
				}
			}

			this._artistService.getArtists(this.token, page).subscribe(
			response=>{

				if(!response.artists){
					this._router.navigate(['/']);
				}else{
					this.artists = response.artists;
				}
			},
			error=>{
				var errorMessage = <any>error;
		    	if(errorMessage != null){
		    		console.log(errorMessage);
		    	}
			});
		});
	}

}

