import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../core/models/message.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message!: Message;
  @Input() isLatest: boolean = false;
  
  @Output() regenerate = new EventEmitter<string>();
  @Output() edit = new EventEmitter<{ id: string; content: string }>();
  
  showActions = false;
  copied = false;

  get isUser(): boolean {
    return this.message.role === 'user';
  }

  get isAssistant(): boolean {
    return this.message.role === 'assistant';
  }

  get formattedTime(): string {
    return this.message.timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get userInitial(): string {
    return 'N'; 
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.message.content);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  onRegenerateResponse() {
    if (this.isAssistant && this.isLatest) {
      this.regenerate.emit(this.message.id);
    }
  }

  onEditMessage() {
    if (this.isUser) {
      this.edit.emit({
        id: this.message.id,
        content: this.message.content
      });
    }
  }
}