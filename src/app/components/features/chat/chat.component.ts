import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';

import { AiService } from '../../../core/services/ai.service';
import { Conversation, Message } from '../../../core/models/message.model';
import { InputBoxComponent } from '../../shared/input-box/input-box.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageComponent, InputBoxComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentConversation: Conversation | null = null;
  messages: Message[] = [];

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.aiService.currentConversation$.subscribe(conv => {
      this.currentConversation = conv;
      this.messages = conv?.messages || [];
    });
  }

  async onSendMessage(content: string) {
    await this.aiService.sendMessage(content);
  }

  // async onSendMessage(event: { text: string; file?: File | null }) {
  //   await this.aiService.sendMessage(event.text.file);
  // }


}