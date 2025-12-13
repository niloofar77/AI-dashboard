import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-uploadfile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './uploadfile.component.html',
  styleUrl: './uploadfile.component.css'
})
export class UploadfileComponent {

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
    console.log("fileeeeeeeeeeeeeeee")
    if (file) {
      this.fileUploadedForm.patchValue({ fileUploaded: file });
      this.fileSelected.emit(file);   
    }
    console.log("file",file)
  }
}