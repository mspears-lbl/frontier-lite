import { Component, effect, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { Subject } from 'rxjs';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AddProjectThreatRequest, AnalysisProjectData, ProjectThreat } from '../../models/analysis-project';
import { getThreatIcon, getThreatName, ThreatType } from '../../../models/threats';
import { NewProjectThreatService } from '../new-project-threat/new-project-threat.service';
import { CommonModule } from '@angular/common';
import { ProjectThreatViewComponent } from '../project-threat-view/project-threat-view.component';
import { ProjectStatsViewComponent } from '../project-stats-view/project-stats-view.component';
import { EditProjectInfoService } from '../edit-project-info/edit-project-info.service';
import { AnalysisProjectStore } from '../../stores/projects-store';

@Component({
  selector: 'app-project-analysis-home',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    ProjectThreatViewComponent,
    ProjectStatsViewComponent
  ],
  templateUrl: './project-analysis-home.component.html',
  styleUrl: './project-analysis-home.component.scss'
})
export class ProjectAnalysisHomeComponent {
    private ngUnSubscribe = new Subject<void>();
    readonly store = inject(ActiveProjectStore);
    readonly projectListStore = inject(AnalysisProjectStore)
    /** The ID of the selected analysis project */
    private id: string | null | undefined;
    private project: AnalysisProjectData | null | undefined;
    get name(): string | null | undefined {
        return this.project?.name;
    }
    get description(): string | null | undefined {
        return this.project?.description;
    }
    get threats(): ProjectThreat[] {
        return this.project?.threats || [];
    }
    public dataChanged$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private newThreatService: NewProjectThreatService,
        private editProjectService: EditProjectInfoService
    ) {
        this.watchDataChanges();
    }

    ngOnInit() {
        this.dataChanged$ = new Subject<void>();
        this.setIdFromRoute();
    }

    private setIdFromRoute(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log('analysis project id:', this.id);
            this.loadProject();
        });
    }

    private watchDataChanges(): void {
        effect(() => {
            this.project = this.store.data();
            console.log('store data changed...', this.project);
            this.dataChanged$.next();
        });
    }

    private async loadProject(): Promise<void> {
        if (this.id) {
            console.log(`load the analysis project data for id ${this.id}...`)
            const results = await this.store.loadData(this.id);
            console.log('results...')
            console.log(results);
        }
    }

    public addThreat(): void {
        if (!this.project) {
            return;
        }
        this.newThreatService.open({projectId: this.project.id})
            .subscribe((result: boolean) => {
                if (result) {
                    this.store.reloadData();
                }
            });
    }

    public getThreatIcon(threatType: ThreatType): string {
        return getThreatIcon(threatType);
    }

    public getThreatName(threatType: ThreatType): string {
        return getThreatName(threatType);
    }

    public editProject(): void {
        if (!this.project) {
            return;
        }
        this.editProjectService.open({ project: this.project })
            .subscribe((result: boolean) => {
                if (result) {
                    this.store.reloadData();
                    this.projectListStore.loadData();
                }
            });
    }
}
