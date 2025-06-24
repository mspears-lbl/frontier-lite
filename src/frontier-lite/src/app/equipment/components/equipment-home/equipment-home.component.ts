import { Component, EventEmitter } from '@angular/core';
import { EquipmentTableComponent } from '../equipment-table/equipment-table.component';
import { EquipmentMapComponent } from '../equipment-map/equipment-map.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-equipment-home',
  imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        EquipmentTableComponent,
        EquipmentMapComponent
  ],
  templateUrl: './equipment-home.component.html',
  styleUrl: './equipment-home.component.scss'
})
export class EquipmentHomeComponent {

    public viewEquipment = new EventEmitter<string | null>();

    public viewEquipmentHandler(id: string): void {
        console.log('view equipment with id');
        console.log(id);
        this.viewEquipment.emit(id);
    }

    public zoomToAll(): void {
        console.log('zoom to all');
        this.viewEquipment.emit(null);
    }
}
