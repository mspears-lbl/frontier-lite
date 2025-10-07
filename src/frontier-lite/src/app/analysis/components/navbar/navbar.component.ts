import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class NavbarComponent {
    private _authenticated = false;
    get authenticated(): boolean {
        return this._authenticated;
    }
    private _showAdmin = false;
    get showAdmin(): boolean {
        return this._showAdmin;
    }
    private _showPower = false;
    get showPower(): boolean {
        return this._showPower;
    }

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(): void {
    }

}
