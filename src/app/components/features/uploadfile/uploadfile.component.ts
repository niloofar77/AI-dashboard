import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilechipComponent } from "../../shared/filechip/filechip.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploadfile',
  standalone: true,
  imports: [ReactiveFormsModule, FilechipComponent,CommonModule],
  templateUrl: './uploadfile.component.html',
  styleUrl: './uploadfile.component.css'
})
export class UploadfileComponent {
  showFile:boolean=false
  fileName: string = '';
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileUploadedForm = new FormGroup({
    fileUploaded: new FormControl<File | null>(null),
  });

  openDialog() {
    this.fileInput.nativeElement.click();
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
  
    if (file) {
      this.showFile = !this.showFile;
      this.fileName = file.name;
  
      this.fileUploadedForm.patchValue({ fileUploaded: file });
  
      this.fileSelected.emit(file);
    }
    }
    }
  
