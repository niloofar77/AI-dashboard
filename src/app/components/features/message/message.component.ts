import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../core/models/message.model';
import { AlertCustomComponent } from "../../shared/alert-custom/alert-custom.component";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, AlertCustomComponent],
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
  showAlert:boolean=false
  messageInput="message copied successfully!"

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
  
  copyMessage(messageContent: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageContent).then(() => {
        console.log("Message copied to clipboard!");
        this.showAlert=true;
      }).catch((error) => {
        console.error("Failed to copy message: ", error);
      });
    } else {
      console.log("Clipboard API not supported. Falling back to execCommand.");
      const textArea = document.createElement('textarea');
      textArea.value = messageContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
  
  
}