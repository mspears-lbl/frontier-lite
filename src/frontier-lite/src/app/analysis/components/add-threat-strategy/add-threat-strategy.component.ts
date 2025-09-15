import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Equipment, EquipmentCollectionData } from '../../../models/equipment';
import { ActiveEquipmentCollectionStore } from '../../../equipment/stores/active-equipment-collection.store';
import { getResilienceStrategyName, getStrategiesForEquipment } from '../../models/resilience-strategy';
import { getResilienceStrategyConstants } from '../../models/calc-constants';
import { StrategyEditChange, StrategyEditComponent } from '../strategy-edit/strategy-edit.component';
import { getThreatData } from '../../models/threat-data';
import { CalcParams, isCalcParams, PortfolioCalculator } from '../../models/portfolio-calculator';
import { deepCopy } from '../../../models/deep-copy';
import { getCdfCoeff } from '../../models/cdf-coeff';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FrontierField, getFieldDescription } from '../../../utils/app-definitions';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AddProjectThreatStrategyParams, AnalysisProjectData, ThreatStrategyData } from '../../models/analysis-project';
import { MessageService } from '../../../services/message.service';
import { PortfolioCalculatorInitial } from '../../models/portfolio-calculator/calculator-initial';
import { getThreatName } from '../../../models/threats';

@Component({
    selector: 'app-add-threat-strategy',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        StrategyEditComponent
    ],
    templateUrl: './add-threat-strategy.component.html',
    styleUrl: './add-threat-strategy.component.scss'
})
export class AddThreatStrategyComponent {
    private store = inject(ActiveEquipmentCollectionStore);
    readonly activeProject = inject(ActiveProjectStore)
    private equipmentId: string | null | undefined;
    private equipmentCollection: EquipmentCollectionData | null | undefined;
    private equipment: Equipment | null | undefined;
    // public strategyCalcs: ThreatStrategyData[] = [];
    public strategyCalcs: AddProjectThreatStrategyParams[] = [];
    private project: AnalysisProjectData | null | undefined;
    private projectId: string | null | undefined;
    private threatId: string | null | undefined;
    public threatName: string | null | undefined;

    get fields(): typeof FrontierField {
        return FrontierField;
    }
    get equipmentName(): string | null | undefined {
        return this.equipment?.name || null;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        // effect(() => {
        //     console.log('store data changed');
        //     console.log(this.store.data());
        //     this.equipmentCollection = this.store.data();
        //     this.project = this.activeProject.data();
        //     this.setStrategies();
        // });
    }

    ngOnInit() {
        this.strategyCalcs = [];
        this.setIdFromRoute();
    }

    private setIdFromRoute(): void {
        this.route.params.subscribe(params => {
            this.equipmentId = params['equipmentId'];
            console.log(`add strategies for equipment ${this.equipmentId}`);
        });
        this.route.parent?.params.subscribe(data => {
            console.log('route data ❤️', data);
            this.projectId = data['id'];
            this.threatId = data['threatId'];
            this.equipmentCollection = this.store.data();
            this.project = this.activeProject.data();
            this.setThreatName();
            this.setEquipment();
            this.setStrategies();
        });
    }

    private setThreatName(): void {
        if (this.threatId && this.project) {
            const threat = this.project.threats.find(item => item.id === this.threatId);
            this.threatName = threat ? getThreatName(threat.threatType) : undefined;
        }
    }

    private setEquipment(): void {
        this.equipment = this.equipmentId && this.equipmentCollection
            ? this.equipmentCollection.data.find(item => item.id === this.equipmentId)
            : undefined;
    }

    private setStrategies(): void {
        this.strategyCalcs = [];
        const equipment = this.getSelectedEquipment();
        console.log('equipment', equipment);
        const strategies = equipment
            ? getStrategiesForEquipment(equipment.equipmentType)
            : undefined;
        const threatData = equipment ? getThreatData(equipment?.equipmentType) : undefined;
        if (threatData && strategies?.length) {
            for (let strategyType of strategies || []) {
                const constants = getResilienceStrategyConstants(strategyType)
                console.log(constants);
                const calcParams: CalcParams = {
                    threatData: deepCopy(threatData),
                    inputData: constants,
                    cdfCoeff: getCdfCoeff()
                }
                const results = isCalcParams(calcParams)
                    ? PortfolioCalculator.run(calcParams)
                    : undefined;
                if (!results) {
                    throw new Error('Unable to run strategy calculations!');
                }
                const data: ThreatStrategyData = {
                    calcParams,
                    outputInitial: results.initial,
                    outputIntermediate: results.intermediate,
                    outputFinal: results.final
                }
                // const results = PortfolioCalculator.run(params);
                // console.log('results!', results);
                const strategyParams: AddProjectThreatStrategyParams = {
                    threatId: this.threatId!,
                    equipmentId: this.equipmentId!,
                    strategyType: strategyType,
                    name: getResilienceStrategyName(strategyType),
                    data: deepCopy(data)
                }
                this.strategyCalcs.push(strategyParams);
            }
        }
        console.log('strategies', strategies);
    }

    private getSelectedEquipment(): Equipment | null | undefined {
        if (this.equipmentId && this.equipmentCollection) {
            return this.equipmentCollection.data.find(item => item.id === this.equipmentId);
        }
        return;
    }

    public strategyChange(value: StrategyEditChange): void {
        console.log(`strategy change:`, value);
    }

    public backToEquipment(): void {
        console.log('back to equipment');
        this.router.navigate(
            ['../..', 'threat-equipment'],
            {relativeTo: this.route}
        );
    }

    public addStrategies(): void {
        const params: AddProjectThreatStrategyParams[] = this.strategyCalcs.map(item => ({
            name: item.name,
            threatId: item.threatId,
            equipmentId: item.equipmentId,
            strategyType: item.strategyType,
            data: deepCopy(item.data)
        }));
        console.log('add Strategies...', this.strategyCalcs, this.project, this.route, this.projectId, this.threatId);
        console.log(params);
        this.activeProject.addThreatStrategies(params);
    }

    public getFieldDescription(field: FrontierField): string {
        return getFieldDescription(field);
    }
}
