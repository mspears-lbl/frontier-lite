import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AnalysisProjectData, ProjectThreatStrategy } from '../../models/analysis-project';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CalcParams } from '../../models/portfolio-calculator';
import { FrontierField, getFieldDescription } from '../../../utils/app-definitions';
import { ResilienceCalcInitial } from '../../models/portfolio-calculator/calculator-initial';
import { ResilienceCalcIntermediate } from '../../models/portfolio-calculator/calculator-intermediate';
import { ResilienceCalcFinal } from '../../models/portfolio-calculator/calculator-final';
import { numberValidator } from '../../../utils/number-validator';
import { getResilienceStrategyName } from '../../models/resilience-strategy';
import { MatSliderModule } from '@angular/material/slider';
import { deepCopy } from '../../../models/deep-copy';

@Component({
    selector: 'app-edit-threat-strategy',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    providers: [
        DecimalPipe
    ],
    templateUrl: './edit-threat-strategy.component.html',
    styleUrl: './edit-threat-strategy.component.scss'
})
export class EditThreatStrategyComponent {
    readonly store = inject(ActiveProjectStore);
    private threatId: string | null | undefined;
    private strategyId: number | null | undefined;
    private project: AnalysisProjectData | null | undefined;
    private strategy: ProjectThreatStrategy | null | undefined;
    public strategyName: string | null | undefined;
    get name(): string | null | undefined {
        return this.project?.name;
    }
    public form: FormGroup | undefined;
    public params: CalcParams | null | undefined;
    public outputInitial: ResilienceCalcInitial | null | undefined;
    public outputIntermediate: ResilienceCalcIntermediate | null | undefined;
    public outputFinal: ResilienceCalcFinal | null | undefined;
    private bcRatio: number | undefined;
    get benefitCostRatio(): number | undefined {
        return this.bcRatio;
    }

    get fields(): typeof FrontierField {
        return FrontierField;
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private dp: DecimalPipe
    ) {
    }

    ngOnInit() {
        this.setIdFromRoute();
    }

    private setIdFromRoute(): void {
        this.route.params.subscribe(params => {
            console.log('params:', params);
            this.threatId = params['threatId'];
            this.strategyId = +params['strategyId'];
            console.log('analysis project id:', this.strategyId);
            this.project = this.store.data();
            this.setStrategyData();
            this.setStrategyName();
            this.setBenefitCostRatio();
            this.buildForm();
        });
    }

    /** Set the ProjectThreatStrategy object based on the components given parameters */
    private setStrategyData(): void {
        const threat = this.project?.threats.find(item => item.id === this.threatId);
        this.strategy = threat?.strategies
            ? threat.strategies.find(item => item.id === this.strategyId)
            : null;
        this.params = deepCopy(this.strategy?.data.calcParams);
        this.outputInitial = deepCopy(this.strategy?.data.outputInitial);
        this.outputIntermediate = deepCopy(this.strategy?.data.outputIntermediate);
        this.outputFinal = deepCopy(this.strategy?.data.outputFinal);
    }

    private setStrategyName(): void {
        this.strategyName = this.strategy?.strategyType
            ? getResilienceStrategyName(this.strategy.strategyType)
            : undefined;
    }

    public getFieldDescription(field: FrontierField): string {
        return getFieldDescription(field);
    }

    private buildForm(): void {
        if (this.strategy && this.params) {
            this.form = this.fb.group({
                name: [this.strategy.name, [Validators.required, Validators.maxLength(100)]],
                discountRate: [this.params.inputData.discountRate * 100, [Validators.required, Validators.maxLength(50), numberValidator()]],
                lifespan: [this.params.inputData.lifespan, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualFixedCost: [this.params.inputData.annualFixedCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualOtherCost: [this.params.inputData.annualOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedUtilityCost: [this.params.inputData.avoidedUtilityCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedOtherCost: [this.params.inputData.avoidedOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                supplyChainIndex: [this.params.inputData.supplyChainIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                communitySupportIndex: [this.params.inputData.communitySupportIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                energyIndependenceIndex: [this.params.inputData.energyIndependenceIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                sustainabilityIndex: [this.params.inputData.sustainabilityIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualAvoidedCustomerCost: [this.dp.transform(this.outputIntermediate?.annualAvoidedCustomerCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                capEx: [this.dp.transform(this.outputIntermediate?.capEx ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                omCost: [this.dp.transform(this.outputIntermediate?.omCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                customers: [this.params.inputData.customersAffected, [Validators.required, Validators.maxLength(50), numberValidator()]],
                outageDuration: [this.params.inputData.outageDuration, [Validators.required, Validators.maxLength(50), numberValidator()]],
                threatFrequency: [this.params.inputData.threatFrequency, [Validators.required, Validators.maxLength(50), numberValidator()]],
            });
            this.form.valueChanges.subscribe((values) => {
                console.log('formChanges', values);
            });
        }
        else {
            this.form = undefined;
        }

    }

    private setBenefitCostRatio(): void {
        this.bcRatio = this.outputFinal?.cost
            ? this.outputFinal.benefit / this.outputFinal.cost
            : undefined;
    }
}
