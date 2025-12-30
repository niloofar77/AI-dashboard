import { Component } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { ChatComponent } from '../features/chat/chat.component';
import { HeaderCustomComponent } from '../shared/header-custom/header-custom.component';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent,ChatComponent,HeaderCustomComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
