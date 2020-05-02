import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { Global } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Song } from './models/song';
import { faCloudMoon, faMoon, faCloudMoonRain, faSun, faSnowflake, faBolt, faCloud, faCloudRain, faPooStorm } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
    faCloudMoon = faCloudMoon;
    faMoon = faMoon;
    faCloudMoonRain = faCloudMoonRain;
    faSun = faSun;
    faSnowflake = faSnowflake;
    faBolt = faBolt;
    faCloud = faCloud;
    faCloudRain = faCloudRain;
    faPooStorm = faPooStorm;
  	public title = 'Glosh';
  	public userLogin: User;
  	public userRegister: User;
  	public identity;
  	public token;
    public alertMessageLogin = false;
    public alertMessageRegister = false;
    public alertMessage: string;
    public url;
    public email;
    public clima: string;
    public cp = 1842;
    public hora;

  	constructor(
        private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute
      ){
  		this.userLogin = new User('', '', '', '', '', 'ROLE_USER', '', '', false);
  		this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '', '', false);
      this.identity = false;
      this.url = Global.url;
      var hora = new Date();
      this.hora = hora.getHours();
  	} 

    ngOnInit(){
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.getClima();
    }

  	public onSubmitLogin(){

      // Conseguir datos del usuario identificado
      this._userService.signIn(this.userLogin, false).subscribe(
          response=>{
            this.alertMessageLogin = false;
            var identity = response.user;
            this.identity = identity;

            if(this.identity._id == ""){
              alert("El usuario no esta correctamente identificado");
            }else{
              // Crear elemento en el local storage

              localStorage.setItem('identity', JSON.stringify(identity));

              // Conseguir el token para enviarselo a cada peticion
              this._userService.signIn(this.userLogin, true).subscribe(
                    response=>{

                      var token = response.token;
                      this.token = token;

                      if(!this.token){
                        alert("El token no se ha generado correctamente");
                      }else{
                        // Crear elemento en el local storage para tener token disponible
                        this.userLogin = new User('', '', '', '', '', 'ROLE_USER', '', '', false);
                        localStorage.setItem('token', JSON.stringify(token));
                      }            
                    },
                    error=>{
                      var errorMessage = <any>error;
                      if(errorMessage != null){
                        this.alertMessageLogin = true;
                        this.alertMessage = error.error.message;
                      }
                    });
                  }
            
          },
          error=>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              this.alertMessageLogin = true;
              this.alertMessage = error.error.message;
            }
          });
  	}

  	public onSubmitRegister(){

      this.email = {
        'from': 'agustinannacondia@gmail.com',
        'to': this.userRegister.email,
        'subject': 'Bienvenido/a a Glosh',
        'name': this.userRegister.name
      };

      console.log(this.email);

      this._userService.sendConfirmationEmail(this.email).subscribe(
        response=>{
         console.log("Formulario de contacto", "Mensaje enviado correctamente", 'success');
       }, error=>{
         console.log(error);
       });
 

      this._userService.signUp(this.userRegister).subscribe(

        response => {
            let user = response.user;
            this.userRegister = user;

            if(!user._id){
              alert("Error al registrarse");
            }else{
              this.alertMessageRegister = true;
              this.alertMessage = "El usuario se ha creado correctamente";
              this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '', '', false);
            }
        },
        error => {
          var errorMessage = <any>error;
          if(errorMessage != null){
            console.log(error);
          }
        }

      );

  	}

    public logout(){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      this.identity = null;
      this.token = null;
      this._router.navigate(['/']);
    }

    public getClima(){
       this._userService.getClima(this.cp).subscribe(
         response=>{
            if(response && response.weather && response.weather[0].main){
              this.clima = response.weather[0].main;
              console.log(this.clima);
              }else{
                console.log(response);
            } 
         }, error=>{
             console.log(error)
         });
    }
}
