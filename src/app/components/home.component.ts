import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'home',
	templateUrl: '../views/home.html'
})
export class HomeComponent implements OnInit{
	public titulo: string;

	constructor(
			private _router: Router,
			private _route: ActivatedRoute
		){
		this.titulo = "Inicio";
	}

	ngOnInit(){
	}
}
