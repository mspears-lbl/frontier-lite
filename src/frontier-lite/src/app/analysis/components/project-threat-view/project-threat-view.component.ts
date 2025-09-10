import { Component, inject, Input } from '@angular/core';
import { ProjectThreat, ProjectThreatStrategy } from '../../models/analysis-project';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatabaseService } from '../../../services/database.service';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AddEquipmentStrategyComponent } from '../add-equipment-strategy/add-equipment-strategy.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getResilienceStrategyName } from '../../models/resilience-strategy';
import { ActiveEquipmentCollectionStore } from '../../../equipment/stores/active-equipment-collection.store';
import { Equipment, EquipmentCollectionData } from '../../../models/equipment';
import { EquipmentService } from '../../../equipment/services/equipment.service';

interface EquipmentStrategy {
    equipmentId: string;
    strategies: ProjectThreatStrategy[]
}

interface TableRow {
    id: number;
    equipmentName: string;
    strategyName: string;
    strategyTypeName: string;
    benefit: number | null | undefined;
    cost: number | null | undefined;
    benefitCost: number | null | undefined;
    ref: ProjectThreatStrategy;
}

interface TableColumn {
    name: string;
    id: string;
    getValue: (row: TableRow) => any;
    numberFormat?: string;
}


@Component({
  selector: 'app-project-threat-view',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './project-threat-view.component.html',
  styleUrl: './project-threat-view.component.scss'
})
export class ProjectThreatViewComponent {
    readonly projectStore = inject(ActiveProjectStore);
    private store = inject(ActiveEquipmentCollectionStore);

    private equipmentCollection: EquipmentCollectionData | null | undefined;

    @Input()
    projectThreat: ProjectThreat | null | undefined;

    get name(): string | null | undefined {
        return this.projectThreat?.name;
    }
    get description(): string | null | undefined {
        return this.projectThreat?.description;
    }

    public data: EquipmentStrategy[] = [];
    public columns: TableColumn[] = [
        { id: 'action', name: '', getValue: (row: TableRow) => null },
        { id: 'equipmentName', name: 'Equipment', getValue: (row: TableRow) => row.equipmentName },
        { id: 'strategyTypeName', name: 'Strategy', getValue: (row: TableRow) => row.strategyTypeName},
        { id: 'benefit', name: 'Benefit', getValue: (row: TableRow) => row.benefit, numberFormat: '1.0-0'},
        { id: 'cost', name: 'Cost', getValue: (row: TableRow) => row.cost, numberFormat: '1.0-0'},
        { id: 'benefitCost', name: 'Benefit/Cost', getValue: (row: TableRow) => row.benefitCost, numberFormat: '1.2-2'},
    ];
    public displayedColumns = this.columns.map(item => item.id);
    public dataSource = new MatTableDataSource<TableRow>();


    constructor(
        private confirmService: ConfirmDialogService,
        private router: Router,
        private route: ActivatedRoute,
        private equipmentService: EquipmentService
    ) {
        this.data = [];
    }

    ngOnInit() {
        console.log('threat view...', this.projectThreat);
        // this.buildData();
        this.setTableData();
    }

    // private buildData(): void {
    //     const data: EquipmentStrategy[] = [];
    //     if (this.projectThreat?.strategies) {
    //         for (const strategy of this.projectThreat.strategies) {
    //             const found = data.find(d => d.equipmentId === strategy.equipmentId);
    //             if (!found) {
    //                 data.push({equipmentId: strategy.equipmentId, strategies: [strategy]});
    //             }
    //             else {
    //                 found.strategies.push(strategy);
    //             }
    //         }
    //     }
    //     this.data = data;
    // }

    private async setTableData(): Promise<void> {
        this.dataSource.data = [];
        const rows: TableRow[] = [];
        console.log('set table data', this.projectThreat);
        try {
            for (let item of this.projectThreat?.strategies|| []) {
                const benefitCost = item.data.outputFinal.cost
                    ? item.data.outputFinal.benefit / item.data.outputFinal.cost
                    : null;
                const equipment = await this.getEquipment(item.equipmentId);
                const row: TableRow = {
                    id: item.id,
                    equipmentName: equipment?.name || 'Unknown',
                    strategyName: 'strategy Name',
                    strategyTypeName: getResilienceStrategyName(item.strategyType),
                    benefit: item.data.outputFinal.benefit,
                    cost: item.data.outputFinal.cost,
                    benefitCost,
                    ref: item
                };
                rows.push(row);
            }
        } catch (error: any) {
            console.log('error loading table data');
            console.log(error);
        }
        this.dataSource.data = rows;
    }


    public addEquipmentStrategy(): void {
        console.log('navigate to...', this.route);
        console.log(this.router.url);
        this.router.navigate(['equipment-strategy', this.projectThreat?.id], {relativeTo: this.route})
    }

    public delete(strategyId: number): void {
        console.log(`delete strategy: ${strategyId}`)
    }

    public deleteThreat(): void {
        console.log(`delete project threat: ${this.projectThreat?.id}`)
        if (this.projectThreat) {
            this.confirmService.confirm('Are you sure you want to delete this Project Threat?')
                .subscribe(result => {
                    if (result) {
                        this.projectStore.removeThreat(this.projectThreat!.id)
                    }
                });
        }
    }

    private async getEquipment(equipmentId: string): Promise<Equipment | null | undefined> {
        try {
            const results = await this.equipmentService.getById(equipmentId);
            return results;
        }
        catch (error) {
            console.log(`unable to find equipment ${equipmentId}`);
            console.log(error);
            return;
        }
    }

}
