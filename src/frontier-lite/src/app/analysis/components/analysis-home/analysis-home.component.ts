import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThreatMapComponent } from '../threat-map/threat-map.component';
import { ThreatInfo } from '../../../../../../common/models/threat-info';
import { ThreatTableComponent } from '../threat-table/threat-table.component';
import { LocationFinderComponent } from '../../../location-finder/location-finder/location-finder.component';
import { LocationResult } from '../../../../../../common/models/find-locations';
import { ProjectListComponent } from '../project-list/project-list.component';
import { NewAnalysisProjectService } from '../new-analysis-project/new-analysis-project.service';
import { AnalysisProjectStore } from '../../stores/projects-store';
import { AnalysisProject } from '../../models/analysis-project';
import { ProjectSummaryHomeComponent } from '../project-summary-home/project-summary-home.component';

@Component({
  selector: 'app-analysis-home',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    ThreatMapComponent,
    ThreatTableComponent,
    LocationFinderComponent,
    ProjectListComponent,
    ProjectSummaryHomeComponent
  ],
  templateUrl: './analysis-home.component.html',
  styleUrl: './analysis-home.component.scss'
})
export class AnalysisHomeComponent {
    private store = inject(AnalysisProjectStore);
    public threatInfo$ = new EventEmitter<ThreatInfo[]>();
    public viewThreat$ = new EventEmitter<string>();
    public viewLocation$ = new EventEmitter<LocationResult>();
    private projects: AnalysisProject[] | null | undefined;

    constructor(
        private newProjectService: NewAnalysisProjectService
    ) {
        effect(() => {
            this.projects = this.store.data();
            console.log(`projects:`, this.projects);
        });
    }

    public createProject(): void {
        this.newProjectService.open()
            .subscribe((result: boolean) => {
                console.log(`project created result ${result}`);
                if (result) {
                    this.store.loadData();
                }
            });
    }

    public handleThreatInfoEvent(params: ThreatInfo[]): void {
        console.log('Received threat info:', params);
        this.threatInfo$.emit(params);
    }

    public handleViewThreatEvent(id: string): void {
        console.log(`view the threat ${id}`)
        this.viewThreat$.emit(id);
    }

    public handleLocationSelect(location: LocationResult): void {
        console.log(`home handle location`, location);
        this.viewLocation$.emit(location);
    }
}
