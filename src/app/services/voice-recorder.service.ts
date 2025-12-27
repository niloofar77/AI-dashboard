import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecorderService {
  
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  
  isRecording = false;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
      
    } catch (error) {
      console.error(' error in microphone', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        throw new Error('ضبط شروع نشده است');
      }
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        resolve(audioBlob);
      };
      
      this.mediaRecorder.stop();
      
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  cancelRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.audioChunks = [];
      this.isRecording = false;
    }
  }
}