import { Component, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormControl, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
    showPassword:boolean=false;
    private router=inject(Router);

    constructor(private loginService:LoginService){

    }
  googleLogin(){
    console.log("jjjjjjjjjjj")
  }
  togglePassword(){
    this.showPassword=!this.showPassword;
  }
  handleLogin(){
    const username=this.loginForm.get("username")?.value??"";
    console.log("username",username)
    const password=this.loginForm.get("password")?.value??"";
    console.log("pass",password)
    const isLoggedIn = this.loginService.login(username, password);

    if (isLoggedIn) {
      console.log("okkkkkkk")
      this.router.navigate(["/"])


    } else {
      console.log('Invalid credentials');
    }
  }

  

}
