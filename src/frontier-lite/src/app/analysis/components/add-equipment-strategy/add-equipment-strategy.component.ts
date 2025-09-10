import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-equipment-strategy',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-equipment-strategy.component.html',
  styleUrl: './add-equipment-strategy.component.scss'
})
export class AddEquipmentStrategyComponent {

}
