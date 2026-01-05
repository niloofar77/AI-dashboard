import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styles: []
})
export class ThemeSwitcherComponent {

  setTheme(theme: string) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      this.setTheme(systemTheme);
      localStorage.setItem('theme', 'system');
    }
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    this.setTheme(savedTheme);
  }
  
}
