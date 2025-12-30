import { Component } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { ChatComponent } from '../features/chat/chat.component';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent,ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
