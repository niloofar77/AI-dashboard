import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-menu-custom',
  imports: [CommonModule],
  templateUrl: './menu-custom.component.html',
  styleUrl: './menu-custom.component.css'
})
export class MenuCustomComponent {
  @Input() showMenu:boolean=false

}
