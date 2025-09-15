import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalcConstant } from '../../models/calc-constants';
import { getResilienceStrategyName, ResilienceStrategyType } from '../../models/resilience-strategy';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { trimmedMinLength } from '../../../utils/trimmed-string-validator';
import { numberValidator } from '../../../utils/number-validator';
import { FrontierField, getFieldDescription } from '../../../utils/app-definitions';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalcParams, isCalcParams } from '../../models/portfolio-calculator';
import { formValueToNumber } from '../../../utils/form-value-to-number';
import { PortfolioCalculatorInitial, ResilienceCalcInitial } from '../../models/portfolio-calculator/calculator-initial';
import { PortfolioCalculatorIntermediate, ResilienceCalcIntermediate } from '../../models/portfolio-calculator/calculator-intermediate';
import { PortfolioCalculatorFinal, ResilienceCalcFinal } from '../../models/portfolio-calculator/calculator-final';
import { deepCopy } from '../../../models/deep-copy';
import { AddProjectThreatStrategyParams, EditProjectThreatStrategyParams, isAddProjectThreatStrategyParams } from '../../models/analysis-project';

interface RunCalculationParams {
    intermediateResultTransform?: (data: ResilienceCalcIntermediate) => ResilienceCalcIntermediate
}

// export interface StrategyEditParams {
//     calcParams: CalcParams;
//     outputInitial: ResilienceCalcInitial | null | undefined;
//     outputIntermediate: ResilienceCalcIntermediate | null | undefined;
//     outputFinal: ResilienceCalcFinal | null | undefined;
// }

export interface StrategyEditChange {
    strategyType: ResilienceStrategyType;
    valid: boolean;
    data?: AddProjectThreatStrategyParams | null | undefined;
}

@Component({
    selector: 'app-strategy-edit',
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSliderModule,
        ReactiveFormsModule,
    ],
    providers: [
        DecimalPipe
    ],
    templateUrl: './strategy-edit.component.html',
    styleUrl: './strategy-edit.component.scss'
})
export class StrategyEditComponent {

    @Input()
    public params: AddProjectThreatStrategyParams | null | undefined;

    public paramsLocal: EditProjectThreatStrategyParams | null | undefined;

    @Output()
    public valueChange = new EventEmitter<StrategyEditChange>();

    public strategyName: string | null | undefined;
    public form: FormGroup | undefined;

    // public outputInitial: ResilienceCalcInitial | null | undefined;
    // public outputIntermediate: ResilienceCalcIntermediate | null | undefined;
    // public outputFinal: ResilienceCalcFinal | null | undefined;

    private bcRatio: number | undefined;
    get benefitCostRatio(): number | undefined {
        return this.bcRatio;
    }
    get cost(): number | null | undefined {
        return this.paramsLocal?.data.outputFinal?.cost
    }
    get benefit(): number | null | undefined {
        return this.paramsLocal?.data.outputFinal?.benefit
    }

    get fields(): typeof FrontierField {
        return FrontierField;
    }

    constructor(
        private fb: FormBuilder,
        private dp: DecimalPipe
    ) {
    }


    ngOnInit() {
        this.paramsLocal = this.params
            ? deepCopy(this.params)
            : undefined;
        // this.outputInitial = this.paramsLocal?.data.outputInitial;
        // this.outputIntermediate = this.paramsLocal?.data.outputIntermediate;
        // this.outputFinal = this.paramsLocal?.data.outputFinal;
        this.setBenefitCostRatio();
        this.setStrategyName();
        this.buildForm();
        this.handleFormChanges();
    }

    private setStrategyName(): void {
        this.strategyName = this.paramsLocal
            ? getResilienceStrategyName(this.paramsLocal.data.calcParams.inputData.strategyType)
            : undefined;
    }

    private buildForm(): void {
        if (this.paramsLocal) {
            this.form = this.fb.group({
                name: [this.paramsLocal.name, [Validators.required, Validators.maxLength(100)]],
                discountRate: [this.paramsLocal.data.calcParams.inputData.discountRate * 100, [Validators.required, Validators.maxLength(50), numberValidator()]],
                lifespan: [this.paramsLocal.data.calcParams.inputData.lifespan, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualFixedCost: [this.paramsLocal.data.calcParams.inputData.annualFixedCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualOtherCost: [this.paramsLocal.data.calcParams.inputData.annualOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedUtilityCost: [this.paramsLocal.data.calcParams.inputData.avoidedUtilityCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedOtherCost: [this.paramsLocal.data.calcParams.inputData.avoidedOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                supplyChainIndex: [this.paramsLocal.data.calcParams.inputData.supplyChainIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                communitySupportIndex: [this.paramsLocal.data.calcParams.inputData.communitySupportIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                energyIndependenceIndex: [this.paramsLocal.data.calcParams.inputData.energyIndependenceIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                sustainabilityIndex: [this.paramsLocal.data.calcParams.inputData.sustainabilityIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualAvoidedCustomerCost: [this.dp.transform(this.paramsLocal.data.outputIntermediate?.annualAvoidedCustomerCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                capEx: [this.dp.transform(this.paramsLocal.data.outputIntermediate?.capEx ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                omCost: [this.dp.transform(this.paramsLocal.data.outputIntermediate?.omCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                customers: [this.paramsLocal.data.calcParams.inputData.customersAffected, [Validators.required, Validators.maxLength(50), numberValidator()]],
                outageDuration: [this.paramsLocal.data.calcParams.inputData.outageDuration, [Validators.required, Validators.maxLength(50), numberValidator()]],
                threatFrequency: [this.paramsLocal.data.calcParams.inputData.threatFrequency, [Validators.required, Validators.maxLength(50), numberValidator()]],
            });
            // this.form.valueChanges.subscribe((values) => {
            //     console.log('formChanges', values);
            // });
        }
        else {
            this.form = undefined;
        }

    }

    public getFieldDescription(field: FrontierField): string {
        return getFieldDescription(field);
    }

    private handleFormChanges(): void {
        if (this.form && this.paramsLocal) {
            this.form.get('name')?.valueChanges.subscribe(value => {
                if (this.form?.get('name')?.valid) {
                    this.paramsLocal!.name = this.form?.get('name')?.value;
                }
                this.emitValueChange();
            });
            this.subscribeToValueChanges(
                this.form.get('customers'),
                (value: number) => this.paramsLocal!.data.calcParams.threatData.customersAffected = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('outageDuration'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.outageDuration = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('threatFrequency'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.threatFrequency = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('lifespan'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.lifespan = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('discountRate'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.discountRate = value / 100,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('avoidedUtilityCost'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.avoidedUtilityCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('avoidedOtherCost'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.avoidedOtherCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('annualAvoidedCustomerCost'),
                (value: number) => {
                    if (this.paramsLocal?.data.outputIntermediate) {
                        this.paramsLocal.data.outputIntermediate.annualAvoidedCustomerCost = value
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
                    if (this.paramsLocal?.data.outputIntermediate) {
                        this.paramsLocal.data.outputIntermediate.capEx = value
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
                    if (this.paramsLocal?.data.outputIntermediate) {
                        this.paramsLocal.data.outputIntermediate.omCost = value
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
                (value: number) => this.paramsLocal!.data.calcParams.inputData.annualFixedCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('annualOtherCost'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.annualOtherCost = value,
                () => this.runCalculations()
            );
            // no need to update the calculations on index updates
            this.subscribeToValueChanges(
                this.form.get('supplyChainIndex'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.supplyChainIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('communitySupportIndex'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.communitySupportIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('energyIndependenceIndex'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.energyIndependenceIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('sustainabilityIndex'),
                (value: number) => this.paramsLocal!.data.calcParams.inputData.sustainabilityIndex = value
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
            // else if (this.calcData) {
            //     this.calcData.final = undefined;
            // }
        })
    }

    private emitValueChange(): void {
        if (!this.paramsLocal) {
            return;
        }
        const data = deepCopy(this.paramsLocal);
        const valid = isAddProjectThreatStrategyParams(data);
        const params: StrategyEditChange = {
            strategyType: this.paramsLocal.strategyType,
            valid,
            data: valid ? data : undefined

        }
        this.valueChange.emit(params);
    }

    // private setBenefitCostRatio(): void {
    //     this.bcRatio = this.calcData?.final?.cost
    //         ? this.calcData.final.benefit / this.calcData.final.cost
    //         : undefined;
    // }

    private runCalculations(params?: RunCalculationParams): void {
        if (this.paramsLocal) {
            this.paramsLocal.data.outputInitial = null;
            this.paramsLocal.data.outputIntermediate = null;
            this.paramsLocal.data.outputFinal = null;
        }
        if (isCalcParams(this.paramsLocal?.data.calcParams)) {
            try {
                const newParams = deepCopy(this.paramsLocal);
                newParams.data.outputInitial = PortfolioCalculatorInitial.run(
                    newParams.data.calcParams.inputData,
                    newParams.data.calcParams.cdfCoeff
                );
                const intermediate = PortfolioCalculatorIntermediate.run(
                    newParams.data.calcParams.threatData,
                    newParams.data.calcParams.inputData,
                    newParams.data.outputInitial
                );
                newParams.data.outputIntermediate = params?.intermediateResultTransform
                    ? params.intermediateResultTransform(intermediate)
                    : intermediate;
                newParams.data.outputFinal = PortfolioCalculatorFinal.run(
                    newParams.data.calcParams.inputData,
                    newParams.data.outputIntermediate
                );
                this.paramsLocal = newParams;
            } catch (error: any) {

            }
        }
        // if (isAddProjectThreatStrategyParams(this.paramsLocal)) {
        //     this.paramsLocal!.data.outputInitial = deepCopy(this.outputInitial);
        // }
        this.setBenefitCostRatio();
        this.emitValueChange();
    }

    private setBenefitCostRatio(): void {
        this.bcRatio = this.paramsLocal?.data.outputFinal?.cost
            ? this.paramsLocal.data.outputFinal.benefit / this.paramsLocal.data.outputFinal.cost
            : undefined;
    }

}
