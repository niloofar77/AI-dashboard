import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private isAuthenticated = false
    login(username:string,password:string){
        if(username==="admin"&&password==="admin"){
            console.log("okkkkkkkkkkkk")
            this.isAuthenticated=true;
            return true;
        }
        else
        {
            this.isAuthenticated=false
            return false;
        }
    }
    isLoggedIn(){
        return this.isAuthenticated;
    }
    





}