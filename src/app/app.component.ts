import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { ChatComponent } from './components/features/chat/chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SidebarComponent,ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ai-app';
}
