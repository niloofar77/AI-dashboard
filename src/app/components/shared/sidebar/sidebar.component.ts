import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AiService } from '../../../core/services/ai.service';
import { Conversation } from '../../../core/models/message.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  
})
export class SidebarComponent implements OnInit {
  conversations: Conversation[] = [];
  currentConversationId: string | null = null;
  @Input() showSidebar : boolean = true;

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.aiService.conversations$.subscribe(convs => {
      this.conversations = convs;
    });

    this.aiService.currentConversation$.subscribe(conv => {
      this.currentConversationId = conv?.id || null;
    });
  }

  newChat() {
    this.aiService.createNewConversation();
  }

  selectChat(id: string) {
    this.aiService.selectConversation(id);
  }

  deleteChat(id: string, event: Event) {
    event.stopPropagation();
    this.aiService.deleteConversation(id);
  }

}