import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquipmentCollectionStore } from './equipment/stores/equipment-collection.store';
import { AnalysisProjectStore } from './analysis/stores/projects-store';

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
    readonly projectsStore = inject(AnalysisProjectStore)

    constructor(
    ) {
    }

    ngOnInit() {
        this.loadEquipment();
    }

    private async loadEquipment() {
        this.store.loadData();
        this.projectsStore.loadData();
    }


}
