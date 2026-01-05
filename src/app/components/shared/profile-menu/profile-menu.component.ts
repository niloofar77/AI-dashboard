import { Component } from '@angular/core';
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";

@Component({
  selector: 'app-profile-menu',
  imports: [ThemeSwitcherComponent],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css'
})
export class ProfileMenuComponent {

}
