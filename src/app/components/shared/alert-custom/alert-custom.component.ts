import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-custom',
  imports: [NgClass],
  templateUrl: './alert-custom.component.html',
  styleUrl: './alert-custom.component.css'
})
export class AlertCustomComponent implements OnInit {
  @Input() message:string="";
  hideAlert:boolean=false;
  ngOnInit(): void {
    setTimeout(()=>{
        this.hideAlert=true;
    },3000)
  }
  

  

}
