import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongAddMultipleComponent } from './components/song-add-multiple.component';
import { PlayerComponent } from './components/player.component';
import { HomeComponent } from './components/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    HomeComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongAddMultipleComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    routing,
    FontAwesomeModule,
    SlickCarouselModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
