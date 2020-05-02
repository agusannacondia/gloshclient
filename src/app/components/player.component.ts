import { Component, OnInit } from '@angular/core';
import { Global } from '../services/global';
import { Song } from '../models/song';
import { Album } from '../models/album';

@Component({
	selector: 'player',
	templateUrl: '../views/player.html'
})
export class PlayerComponent implements OnInit{

	public url: string;
	public song: Song;
	public album: Album;

	constructor(

		){		
			this.url = Global.url;
	}

	ngOnInit(){
		console.log("Player funcionando");
	}

	pause(){
		(document.getElementById("player") as any).pause();
	}
}
