import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActiveProjectStore } from '../../stores/active-project.store';
import { AnalysisProjectData, EditProjectThreatStrategyParams, isThreatStrategyData, ProjectThreatStrategy, ThreatStrategyDataEdit } from '../../models/analysis-project';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CalcParams, isCalcParams } from '../../models/portfolio-calculator';
import { FrontierField, getFieldDescription } from '../../../utils/app-definitions';
import { PortfolioCalculatorInitial, ResilienceCalcInitial } from '../../models/portfolio-calculator/calculator-initial';
import { PortfolioCalculatorIntermediate, ResilienceCalcIntermediate } from '../../models/portfolio-calculator/calculator-intermediate';
import { PortfolioCalculatorFinal, ResilienceCalcFinal } from '../../models/portfolio-calculator/calculator-final';
import { numberValidator } from '../../../utils/number-validator';
import { getResilienceStrategyName } from '../../models/resilience-strategy';
import { MatSliderModule } from '@angular/material/slider';
import { deepCopy } from '../../../models/deep-copy';
import { formValueToNumber } from '../../../utils/form-value-to-number';
import { Equipment, EquipmentCollectionData } from '../../../models/equipment';
import { getThreatName } from '../../../models/threats';
import { getEquipmentTypeName } from '../../../models/equipment-type';
import { DatabaseService } from '../../../services/database.service';

interface RunCalculationParams {
    intermediateResultTransform?: (data: ResilienceCalcIntermediate) => ResilienceCalcIntermediate
}

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
    public strategyData: ThreatStrategyDataEdit | null | undefined;
    private equipmentCollection: EquipmentCollectionData | null | undefined;
    private equipment: Equipment | null | undefined;
    private _equipmentName: string | null | undefined;
    public threatName: string | null | undefined;

    get equipmentName(): string | null | undefined {
        return this._equipmentName;
    }
    // get name(): string | null | undefined {
    //     return this.project?.name;
    // }
    /** Determines if the strategy can be updated. */
    get canUpdate(): boolean {
        return  (
            !this.strategy ||
            !this.strategyData ||
            !isThreatStrategyData(this.strategyData) ||
            !this.form?.valid ||
            !this.form?.dirty
        ) ? false : true;
    }
    get canCancel(): boolean {
        return (
            this.form?.dirty
        ) ? true : false;
    }

    public form: FormGroup | undefined;
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
        private dp: DecimalPipe,
        private dbService: DatabaseService
    ) {
        effect(() => {
            this.project = this.store.data();
            console.log('🍇 store data changed...', this.project);
            this.setComponentData();
        })
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
            this.setComponentData();
        });
    }

    private setComponentData(): void {
        this.project = this.store.data();
        if (this.project && this.strategyId) {
            this.setStrategyData();
            this.setThreatName();
            this.setEquipment();
            this.setBenefitCostRatio();
            this.buildForm();
            this.handleFormChanges();
        }
        else {
            this.project = undefined;
            this.strategy = undefined;
            this.strategyData = undefined;
            this.form = undefined;
        }
    }

    /** Set the ProjectThreatStrategy object based on the components given parameters */
    private setStrategyData(): void {
        const threat = this.project?.threats.find(item => item.id === this.threatId);
        const originalStrategy = threat?.strategies
            ? threat.strategies.find(item => item.id === this.strategyId)
            : null;
        this.strategy = originalStrategy ? deepCopy(originalStrategy) : null;
        this.strategyData = this.strategy
            ? deepCopy(this.strategy.data)
            : undefined;
        // this.params = deepCopy(this.strategy?.data.calcParams);
        // this.outputInitial = deepCopy(this.strategy?.data.outputInitial);
        // this.outputIntermediate = deepCopy(this.strategy?.data.outputIntermediate);
        // this.outputFinal = deepCopy(this.strategy?.data.outputFinal);
    }

    // private setStrategyName(): void {
    //     this.strategyName = this.strategy?.strategyType
    //         ? getResilienceStrategyName(this.strategy.strategyType)
    //         : undefined;
    // }

    private setThreatName(): void {
        if (this.threatId && this.project) {
            const threat = this.project.threats.find(item => item.id === this.threatId);
            this.threatName = threat ? getThreatName(threat.threatType) : undefined;
        }
    }

    private async setEquipment(): Promise<void> {
        const results = this.strategy
            ? await this.dbService.getEquipmentById(this.strategy.equipmentId)
            : undefined;
        this.equipment = results ? results.data : undefined;
        this._equipmentName = this.equipment
            ? `${getEquipmentTypeName(this.equipment.equipmentType)}: ${this.equipment.name}`
            : undefined;
    }


    public getFieldDescription(field: FrontierField): string {
        return getFieldDescription(field);
    }

    private buildForm(): void {
        if (this.strategy && this.strategyData) {
            this.form = this.fb.group({
                name: [this.strategy.name, [Validators.required, Validators.maxLength(100)]],
                discountRate: [this.strategyData.calcParams.inputData.discountRate * 100, [Validators.required, Validators.maxLength(50), numberValidator()]],
                lifespan: [this.strategyData.calcParams.inputData.lifespan, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualFixedCost: [this.strategyData.calcParams.inputData.annualFixedCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualOtherCost: [this.strategyData.calcParams.inputData.annualOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedUtilityCost: [this.strategyData.calcParams.inputData.avoidedUtilityCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedOtherCost: [this.strategyData.calcParams.inputData.avoidedOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                supplyChainIndex: [this.strategyData.calcParams.inputData.supplyChainIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                communitySupportIndex: [this.strategyData.calcParams.inputData.communitySupportIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                energyIndependenceIndex: [this.strategyData.calcParams.inputData.energyIndependenceIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                sustainabilityIndex: [this.strategyData.calcParams.inputData.sustainabilityIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualAvoidedCustomerCost: [this.dp.transform(this.strategyData.outputIntermediate?.annualAvoidedCustomerCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                capEx: [this.dp.transform(this.strategyData.outputIntermediate?.capEx ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                omCost: [this.dp.transform(this.strategyData.outputIntermediate?.omCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                customers: [this.strategyData.calcParams.inputData.customersAffected, [Validators.required, Validators.maxLength(50), numberValidator()]],
                outageDuration: [this.strategyData.calcParams.inputData.outageDuration, [Validators.required, Validators.maxLength(50), numberValidator()]],
                threatFrequency: [this.strategyData.calcParams.inputData.threatFrequency, [Validators.required, Validators.maxLength(50), numberValidator()]],
            });
        }
        else {
            this.form = undefined;
        }

    }

    private setBenefitCostRatio(): void {
        this.bcRatio = this.strategyData?.outputFinal?.cost
            ? this.strategyData.outputFinal.benefit / this.strategyData?.outputFinal.cost
            : undefined;
    }

    public cancel(): void {
        this.setComponentData();
    }

    public async update(): Promise<void> {
        if (!this.strategy || !this.strategyData || !isThreatStrategyData(this.strategyData)) {
            this.messageService.display('Unable to update strategy because of invalid data.');
            return;
        }
        console.log('update the strategy', this.strategy)
        this.strategy.data = deepCopy(this.strategyData);
        const results = await this.store.updateThreatStrategy(this.strategy);
        console.log('results');
        console.log(results);
    }

    private handleFormChanges(): void {
        if (this.form && this.strategyData) {
            this.form.get('name')?.valueChanges.subscribe(value => {
                if (this.form?.get('name')?.valid) {
                    this.strategy!.name = this.form?.get('name')?.value;
                }
            });
            this.subscribeToValueChanges(
                this.form.get('customers'),
                (value: number) => this.strategyData!.calcParams.threatData.customersAffected = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('outageDuration'),
                (value: number) => this.strategyData!.calcParams.inputData.outageDuration = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('threatFrequency'),
                (value: number) => this.strategyData!.calcParams.inputData.threatFrequency = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('lifespan'),
                (value: number) => this.strategyData!.calcParams.inputData.lifespan = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('discountRate'),
                (value: number) => this.strategyData!.calcParams.inputData.discountRate = value / 100,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('avoidedUtilityCost'),
                (value: number) => this.strategyData!.calcParams.inputData.avoidedUtilityCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('avoidedOtherCost'),
                (value: number) => this.strategyData!.calcParams.inputData.avoidedOtherCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('annualAvoidedCustomerCost'),
                (value: number) => {
                    if (this.strategyData?.outputIntermediate) {
                        this.strategyData.outputIntermediate.annualAvoidedCustomerCost = value
                    }
                },
                () => this.runCalculations({
                    intermediateResultTransform: (data: ResilienceCalcIntermediate) => {
                        const value = formValueToNumber(this.form!.get('annualAvoidedCustomerCost')?.value)
                        data.annualAvoidedCustomerCost = typeof value === 'number'
                            ? value
                            : Number.NaN;
                        return data;
                    }
                })
            );
            this.subscribeToValueChanges(
                this.form.get('capEx'),
                (value: number) => {
                    if (this.strategyData?.outputIntermediate) {
                        this.strategyData.outputIntermediate.capEx = value
                    }
                },
                () => this.runCalculations({
                    intermediateResultTransform: (data: ResilienceCalcIntermediate) => {
                        const value = formValueToNumber(this.form!.get('capEx')?.value)
                        data.capEx = typeof value === 'number'
                            ? value
                            : Number.NaN;
                        return data;
                    }
                })
            );
            this.subscribeToValueChanges(
                this.form.get('omCost'),
                (value: number) => {
                    if (this.strategyData?.outputIntermediate) {
                        this.strategyData.outputIntermediate.omCost = value
                    }
                },
                () => this.runCalculations({
                    intermediateResultTransform: (data: ResilienceCalcIntermediate) => {
                        const value = formValueToNumber(this.form!.get('omCost')?.value)
                        data.omCost = typeof value === 'number'
                            ? value
                            : Number.NaN;
                        return data;
                    }
                })
            );
            this.subscribeToValueChanges(
                this.form.get('annualFixedCost'),
                (value: number) => this.strategyData!.calcParams.inputData.annualFixedCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('annualOtherCost'),
                (value: number) => this.strategyData!.calcParams.inputData.annualOtherCost = value,
                () => this.runCalculations()
            );
            // no need to update the calculations on index updates
            this.subscribeToValueChanges(
                this.form.get('supplyChainIndex'),
                (value: number) => this.strategyData!.calcParams.inputData.supplyChainIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('communitySupportIndex'),
                (value: number) => this.strategyData!.calcParams.inputData.communitySupportIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('energyIndependenceIndex'),
                (value: number) => this.strategyData!.calcParams.inputData.energyIndependenceIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('sustainabilityIndex'),
                (value: number) => this.strategyData!.calcParams.inputData.sustainabilityIndex = value
            );
        }
    }

    private subscribeToValueChanges(
        formControl: AbstractControl | null | undefined,
        setNewValue: (value: number) => void,
        onUpdateSuccess?: () => void
    ): void {
        if (!formControl) {
            throw new Error('Form control not initialized');
        }

        formControl.valueChanges.subscribe(() => {
            if (formControl.valid) {
                const newValue = formValueToNumber(formControl.value);
                if (typeof newValue === 'number') {
                    setNewValue(newValue);
                    if (onUpdateSuccess) {
                        onUpdateSuccess();
                    }
                    return;
                }
            }
        })
    }


    private runCalculations(params?: RunCalculationParams): void {
        if (this.strategyData) {
            this.strategyData.outputInitial = null;
            this.strategyData.outputIntermediate = null;
            this.strategyData.outputFinal = null;
        }
        if (isCalcParams(this.strategyData?.calcParams)) {
            try {
                const newParams = deepCopy(this.strategyData);
                this.strategyData.outputInitial = PortfolioCalculatorInitial.run(
                    this.strategyData.calcParams.inputData,
                    this.strategyData.calcParams.cdfCoeff
                );
                const intermediate = PortfolioCalculatorIntermediate.run(
                    this.strategyData.calcParams.threatData,
                    this.strategyData.calcParams.inputData,
                    this.strategyData.outputInitial
                );
                this.strategyData.outputIntermediate = params?.intermediateResultTransform
                    ? params.intermediateResultTransform(intermediate)
                    : intermediate;
                this.strategyData.outputFinal = PortfolioCalculatorFinal.run(
                    this.strategyData.calcParams.inputData,
                    this.strategyData.outputIntermediate
                );
            } catch (error: any) {

            }
        }
        this.setBenefitCostRatio();
    }
}
