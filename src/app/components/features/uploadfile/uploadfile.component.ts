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
  fileNames: string[] = [];
  @Output() fileSelected = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileUploadedForm = new FormGroup({
    fileUploaded: new FormControl<File[] | null>(null),
  });

  openDialog() {
    this.fileInput.nativeElement.click();
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files
  
    if (files) {
    
      const fileArray = Array.from(files); 
      this.fileNames.push(...fileArray.map(file => file.name));
      this.fileUploadedForm.patchValue({ fileUploaded: fileArray });
  
      this.fileSelected.emit(fileArray);
    }
    }
    closeFile(index: number) {
      this.fileNames.splice(index, 1); 
    }

    
    }
  
