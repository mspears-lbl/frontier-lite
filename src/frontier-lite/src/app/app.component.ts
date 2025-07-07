import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquipmentCollectionStore } from './equipment/stores/equipment-collection.store';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly store = inject(EquipmentCollectionStore);

    constructor(
    ) {
    }

    ngOnInit() {
        this.loadEquipment();
    }

    private async loadEquipment() {
        this.store.loadData();
    }


}
