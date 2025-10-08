import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquipmentCollectionStore } from './equipment/stores/equipment-collection.store';
import { AnalysisProjectStore } from './analysis/stores/projects-store';
import { NavbarComponent } from './analysis/components/navbar/navbar.component';
import { StartupAnalysisService } from './analysis/services/startup-analysis.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        NavbarComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly store = inject(EquipmentCollectionStore);
    readonly projectsStore = inject(AnalysisProjectStore);
    readonly startupAnalysisService = inject(StartupAnalysisService);

    constructor(
    ) {
    }

    ngOnInit() {
        this.loadEquipment();
    }

    private async loadEquipment() {
        this.store.loadData();
        await this.startupAnalysisService.analyzeAllProjects();
        this.projectsStore.loadData();
    }


}
