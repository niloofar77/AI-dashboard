import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MenuCustomComponent } from '../../menu-custom/menu-custom.component';

@Component({
  selector: 'app-input-box',
  standalone: true,
  imports: [CommonModule, FormsModule,MenuCustomComponent],
  templateUrl: './input-box.component.html'
})
export class InputBoxComponent {
  @Output() sendMessage = new EventEmitter<string>();
     showSidebar=new BehaviorSubject<Boolean>(false);
  
  inputText = '';
  isLoading = false;
  showMenu=(false)

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