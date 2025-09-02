import { Component, inject, Input } from '@angular/core';
import { ProjectThreat } from '../../models/analysis-project';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatabaseService } from '../../../services/database.service';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { ActiveProjectStore } from '../../stores/active-project.store';

@Component({
  selector: 'app-project-threat-view',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './project-threat-view.component.html',
  styleUrl: './project-threat-view.component.scss'
})
export class ProjectThreatViewComponent {
    readonly store = inject(ActiveProjectStore);

    @Input()
    projectThreat: ProjectThreat | null | undefined;

    get name(): string | null | undefined {
        return this.projectThreat?.name;
    }
    get description(): string | null | undefined {
        return this.projectThreat?.description;
    }

    constructor(
        private confirmService: ConfirmDialogService,
        private dbService: DatabaseService
    ) {
    }

    ngOnInit() {

    }

    public delete(): void {
        console.log(`delete project threat: ${this.projectThreat?.id}`)
        if (this.projectThreat) {
            this.confirmService.confirm('Are you sure you want to delete this Project Threat?')
                .subscribe(result => {
                    if (result) {
                        this.store.removeThreat(this.projectThreat!.id)
                    }
                });
        }
    }
}
