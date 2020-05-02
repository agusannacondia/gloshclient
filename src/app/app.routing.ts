import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component'
import { ArtistDetailComponent } from './components/artist-detail.component';
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongAddMultipleComponent } from './components/song-add-multiple.component';

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: 'artistas/:page', component: ArtistListComponent},
	{path: 'agregar-artista', component: ArtistAddComponent},
	{path: 'editar-artista/:id', component: ArtistEditComponent},
	{path: 'artista/:id', component: ArtistDetailComponent},
	{path: 'agregar-album/:id', component: AlbumAddComponent},
	{path: 'album/:id', component: AlbumDetailComponent},
	{path: 'agregar-cancion/:id', component: SongAddComponent},
	{path: 'agregar-multiples/:id', component: SongAddMultipleComponent},
	{path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);