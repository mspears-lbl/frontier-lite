import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { ActiveEquipmentCollectionStore } from '../../../equipment/stores/active-equipment-collection.store';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { EquipmentCollectionData } from '../../../models/equipment';
import { AddProjectThreatStrategyParams, AnalysisProjectData } from '../../models/analysis-project';
import { getThreatName } from '../../../models/threats';

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
    private store = inject(ActiveEquipmentCollectionStore);
    readonly activeProject = inject(ActiveProjectStore)
    private equipmentId: string | null | undefined;
    private equipmentCollection: EquipmentCollectionData | null | undefined;
    private project: AnalysisProjectData | null | undefined;
    private projectId: string | null | undefined;
    private threatId: string | null | undefined;

    public threatName: string | null | undefined;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        effect(() => {
            console.log('store data changed');
            console.log(this.store.data());
            this.equipmentCollection = this.store.data();
            this.project = this.activeProject.data();
            this.setThreatName();
        });
    }

    ngOnInit() {
        this.setIdFromRoute();
    }

    private setIdFromRoute(): void {
        this.route.params.subscribe(params => {
            console.log('activated route data 💪', params);
            this.projectId = params['id'];
            this.threatId = params['threatId'];
            this.setThreatName();
        });
    }

    private setThreatName(): void {
        if (this.threatId && this.project) {
            const threat = this.project.threats.find(item => item.id === this.threatId);
            this.threatName = threat ? getThreatName(threat.threatType) : undefined;
        }
    }

}
