import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ElectronService } from './electron.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular Electron App';
  isElectron: boolean;

  constructor(private electronService: ElectronService) {
    this.isElectron = this.electronService.isElectron;
  }

  sendMessageToElectron() {
    this.electronService.sendMessage('Hello from Angular!');
  }
}