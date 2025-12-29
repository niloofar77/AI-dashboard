

import { Component, OnDestroy, ViewChild, ElementRef, NgModule, Output, EventEmitter } from '@angular/core';
import { VoiceRecorderService } from '../../../services/voice-recorder.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuCustomComponent } from '../../menu-custom/menu-custom.component';
import { FilechipComponent } from '../filechip/filechip.component';
import { UploadfileComponent } from '../../features/uploadfile/uploadfile.component';


@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css'],
  imports:[CommonModule,FormsModule,MenuCustomComponent,FilechipComponent,UploadfileComponent]
})
export class InputBoxComponent implements OnDestroy {

  inputText: string = '';
  isLoading: boolean = false;
  showMenu: boolean = false;
  @Output() sendMessage = new EventEmitter<string>();
  @Output() voiceMessage = new EventEmitter<string>();
  @Output() fileMessage = new EventEmitter<File>();
  attachedFiles: File[] =[];
  fileName: string = '';
  isRecording: boolean = false;
  recordingTime: number = 0;
  private timerInterval: any = null;

  savedVoiceFiles: { 
    name: string; 
    blob: Blob; 
    url: string;
    duration: number;
  }[] = [];

  constructor(private voiceRecorder: VoiceRecorderService) {}

  ngOnDestroy(): void {
    this.stopTimer();
    
    this.savedVoiceFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    
    if (this.isRecording) {
      this.voiceRecorder.cancelRecording();
    }
  }

  
  async toggleVoice(): Promise<void> {
    if (this.isRecording) {
      await this.stopAndSaveRecording();
    } else {
      await this.startRecording();
    }
  }

  
  async startRecording(): Promise<void> {
    try {
      await this.voiceRecorder.startRecording();
      this.isRecording = true;
      this.startTimer();
      console.log('ضبط شروع شد');
    } catch (error) {
      console.error('خطا در شروع ضبط:', error);
      alert('دسترسی به میکروفون امکان‌پذیر نیست. لطفاً دسترسی را فعال کنید.');
    }
  }

  
  async stopAndSaveRecording(): Promise<void> {
    try {
      const duration = this.recordingTime;
      const audioBlob = await this.voiceRecorder.stopRecording();
      
      this.stopTimer();
      this.isRecording = false;
      
      this.saveVoiceFile(audioBlob, duration);
      
      console.log('ضبط متوقف و ذخیره شد');
    } catch (error) {
      console.error('خطا در ذخیره صدا:', error);
      this.stopTimer();
      this.isRecording = false;
    }
  }


  saveVoiceFile(blob: Blob, duration: number): void {
    const timestamp = new Date();
    const fileName = `voice_${timestamp.getFullYear()}${(timestamp.getMonth()+1).toString().padStart(2,'0')}${timestamp.getDate().toString().padStart(2,'0')}_${timestamp.getHours().toString().padStart(2,'0')}${timestamp.getMinutes().toString().padStart(2,'0')}${timestamp.getSeconds().toString().padStart(2,'0')}.webm`;
    const url = URL.createObjectURL(blob);
    
    this.savedVoiceFiles.push({
      name: fileName,
      blob: blob,
      url: url,
      duration: duration
    });
    
    console.log('فایل ذخیره شد:', fileName);
    console.log('حجم فایل:', (blob.size / 1024).toFixed(2), 'KB');
    console.log('تعداد کل فایل‌ها:', this.savedVoiceFiles.length);


  }

  cancelRecording(): void {

    this.voiceRecorder.cancelRecording();
    this.stopTimer();
    this.isRecording = false;
    console.log('ضبط لغو شد');
  }
  downloadVoice(file: { name: string; blob: Blob; url: string }): void {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('فایل دانلود شد:', file.name);
  }

  deleteVoice(index: number): void {
    if (index >= 0 && index < this.savedVoiceFiles.length) {
      const file = this.savedVoiceFiles[index];
      

      URL.revokeObjectURL(file.url);
      this.savedVoiceFiles.splice(index, 1);
      
      console.log('فایل حذف شد:', file.name);
    }
  }

  clearAllVoices(): void {
    this.savedVoiceFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    this.savedVoiceFiles = [];
    console.log('همه فایل‌ها پاک شدند');
  }

  private startTimer(): void {
    this.recordingTime = 0;
    this.timerInterval = setInterval(() => {
      this.recordingTime++;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.recordingTime = 0;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  handleshowMenu(): void {
    this.showMenu = !this.showMenu;
  }


  closeMenu(): void {
    this.showMenu = false;
  }

  onFileSelected(files: File[]): void {
    if (files && files.length > 0) {
      
      const file = files[0];  
      this.attachedFiles.push(file);   
      this.fileName = file.name;
      console.log('فایل انتخاب شد:', file.name);
      this.showMenu=false;
    }
  }
  





  send(): void {
    if (!this.inputText.trim() && this.attachedFiles.length === 0) {
      return;
    }
    this.isLoading = true;
    console.log('در حال ارسال پیام...');
    console.log('متن:', this.inputText);
    
    if (this.attachedFiles.length > 0) {
      this.attachedFiles.forEach(file => {
        console.log('فایل ضمیمه:', file.name);
        this.fileMessage.emit(file);     
      });
    }
  
    const message = this.inputText;
    this.sendMessage.emit(message);
  
    setTimeout(() => {
      this.isLoading = false;
      this.inputText = '';
      this.attachedFiles = [];
      console.log('پیام ارسال شد');
    }, 1000);
  }
  

  onEnter(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.send();
    }
    
  }
  removeAttachedFile(fileToRemove: File): void {
    const index = this.attachedFiles.indexOf(fileToRemove);
    if (index > -1) {
      this.attachedFiles.splice(index, 1);   
      console.log('فایل حذف شد:', fileToRemove.name);
    }
  }
  

  
  canSend(): boolean {
    return (this.inputText.trim().length > 0 || this.attachedFiles !== null) && !this.isLoading;
  }

  getFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }


  getVoiceFileInfo(file: { name: string; blob: Blob; duration: number }): string {
    const size = this.getFileSize(file.blob.size);
    const duration = this.formatTime(file.duration);
    return `${duration} - ${size}`;
  }


}