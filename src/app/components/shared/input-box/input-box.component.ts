import { Component, Output, EventEmitter, signal, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MenuCustomComponent } from '../../menu-custom/menu-custom.component';
import { UploadfileComponent } from '../../features/uploadfile/uploadfile.component';
import { FilechipComponent } from '../filechip/filechip.component';

@Component({
  selector: 'app-input-box',
  standalone: true,
  imports: [CommonModule, FormsModule,MenuCustomComponent,UploadfileComponent,FilechipComponent],
  templateUrl: './input-box.component.html'
})
export class InputBoxComponent {
  @Output() sendMessage = new EventEmitter<string>();
  showSidebar=new BehaviorSubject<Boolean>(false);
  fileName: string = '';
  inputText = '';
  isLoading = false;
  showMenu=(false)
  attachedFile?: File;
  attachedFilePreviewUrl?: string | null;

  @ViewChild('fileUploader') fileUploader!: UploadfileComponent;
  onEnter(event: KeyboardEvent) {
    if (event.shiftKey) return;
    event.preventDefault();
    this.send();
  }
  toggleSidebar() {
    this.showSidebar.next(!this.showSidebar)
  }
  handleshowMenu(){
      this.showMenu=!this.showMenu
      
  }
  onFileSelected(file: File) {
    this.attachedFile = file;
    this.fileName=file.name;
    console.log(file.name,"jjjjjjjjjjjjjjj")
    this.showMenu = false;

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      this.attachedFilePreviewUrl = url;
    } else {
      this.attachedFilePreviewUrl = null;
    }
  }

  removeAttachedFile() {
    if (this.attachedFilePreviewUrl) {
      URL.revokeObjectURL(this.attachedFilePreviewUrl);
    }
    this.attachedFile = undefined;
    this.attachedFilePreviewUrl = null;
  }

  async send() {
    if (!this.inputText.trim() || this.isLoading) return;
    
    const message = this.inputText;
    this.inputText = '';
    this.isLoading = true;
    this.sendMessage.emit(message);

    
    
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
