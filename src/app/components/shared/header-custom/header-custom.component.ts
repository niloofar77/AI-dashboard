import { Component, EventEmitter, Output } from '@angular/core';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-custom',
  imports: [ProfileMenuComponent,CommonModule],
  templateUrl: './header-custom.component.html',
  styleUrl: './header-custom.component.css'
})
export class HeaderCustomComponent {
  showMenu:boolean=false;
  @Output() showSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleMenu(){
    this.showMenu=!this.showMenu;
  }
  toggleSidebar(){
    this.showSidebar.emit(!this.showSidebar);
  }

}
