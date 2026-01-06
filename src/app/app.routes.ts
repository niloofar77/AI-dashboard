import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/features/login/components/login.component';
import { AuthGuard } from './core/guards/authGuard';

export const routes: Routes = [
    {
        path:"login",component:LoginComponent
    },
    {
        path:"",component:HomeComponent,
        canActivate:[AuthGuard]
    },
];
