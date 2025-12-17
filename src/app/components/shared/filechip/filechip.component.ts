import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filechip',
  imports: [],
  templateUrl: './filechip.component.html',
  styleUrl: './filechip.component.css'
})
export class FilechipComponent {
  @Input()fileName:string=""
  @Output()closeEvent=new EventEmitter()
  
  closeFile(){
    this.closeEvent.emit()
  }

}
