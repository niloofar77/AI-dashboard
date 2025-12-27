// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MessageComponent } from '../message/message.component';

// import { AiService } from '../../../core/services/ai.service';
// import { Conversation, Message } from '../../../core/models/message.model';
// import { InputBoxComponent } from '../../shared/input-box/input-box.component';

// @Component({
//   selector: 'app-chat',
//   standalone: true,
//   imports: [CommonModule, MessageComponent, InputBoxComponent],
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.scss']
// })
// export class ChatComponent implements OnInit {
//   currentConversation: Conversation | null = null;
//   messages: Message[] = [];

//   constructor(private aiService: AiService) {}

//   ngOnInit() {
//     this.aiService.currentConversation$.subscribe(conv => {
//       this.currentConversation = conv;
//       this.messages = conv?.messages || [];
//     });
//   }

//   async onSendMessage(content: string) {
//     await this.aiService.sendMessage(content);
//   }

//   // async onSendMessage(event: { text: string; file?: File | null }) {
//   //   await this.aiService.sendMessage(event.text.file);
//   // }


// }
// chat.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MessageComponent } from '../message/message.component';
import { InputBoxComponent } from '../../shared/input-box/input-box.component';
import { AiService } from '../../../core/services/ai.service';
import { Conversation, Message } from '../../../core/models/message.model';

// اینترفیس برای فایل صوتی
interface VoiceFile {
  name: string;
  blob: Blob;
  url: string;
  duration: number;
  createdAt: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageComponent, InputBoxComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  
  currentConversation: Conversation | null = null;
  messages: Message[] = [];
  savedVoiceFiles: VoiceFile[] = [];
  private destroy$ = new Subject<void>();
  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    this.aiService.currentConversation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conv => {
        this.currentConversation = conv;
        this.messages = conv?.messages || [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    this.savedVoiceFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
  }


  async onSendMessage(content: string): Promise<void> {
    if (!content.trim()) return;
    await this.aiService.sendMessage(content);
  }

  onVoiceMessage(voiceData: { blob: Blob; duration: number }): void {
    console.log('پیام صوتی دریافت شد');
    console.log('حجم:', this.formatFileSize(voiceData.blob.size));
    console.log('مدت:', voiceData.duration, 'ثانیه');

    this.saveVoiceFile(voiceData.blob, voiceData.duration);
  }

  saveVoiceFile(blob: Blob, duration: number): void {
    const timestamp = new Date();
    const fileName = `voice_${this.formatDateForFileName(timestamp)}.webm`;
    const url = URL.createObjectURL(blob);

    const voiceFile: VoiceFile = {
      name: fileName,
      blob: blob,
      url: url,
      duration: duration,
      createdAt: timestamp
    };

    this.savedVoiceFiles.push(voiceFile);
    
    console.log('✅ فایل ذخیره شد:', fileName);
    console.log('📁 تعداد کل فایل‌ها:', this.savedVoiceFiles.length);
  }


  downloadVoice(file: VoiceFile): void {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('⬇️ فایل دانلود شد:', file.name);
  }


  deleteVoice(index: number): void {
    if (index >= 0 && index < this.savedVoiceFiles.length) {
      const file = this.savedVoiceFiles[index];
      URL.revokeObjectURL(file.url);
      this.savedVoiceFiles.splice(index, 1);
      console.log('🗑️ فایل حذف شد:', file.name);
    }
  }

  clearAllVoices(): void {
    this.savedVoiceFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    this.savedVoiceFiles = [];
    console.log('🗑️ همه فایل‌ها پاک شدند');
  }


  onFileMessage(file: File): void {
    console.log('فایل دریافت شد:', file.name);
  }


  private formatDateForFileName(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }


  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }


  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }
}