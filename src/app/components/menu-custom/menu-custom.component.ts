import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-custom.component.html',
  styleUrl: './menu-custom.component.css'
})
export class MenuCustomComponent {
  @Input() showMenu = false;
  @Output() uploadClick = new EventEmitter<void>();


}