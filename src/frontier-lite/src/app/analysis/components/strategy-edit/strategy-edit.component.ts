import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalcConstant } from '../../models/calc-constants';
import { getResilienceStrategyName } from '../../models/resilience-strategy';
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
import { CalcParams, isCalcParams, ResilienceCalcData, ResilienceCalcOutput } from '../../models/portfolio-calculator';
import { formValueToNumber } from '../../../utils/form-value-to-number';
import { PortfolioCalculatorInitial, ResilienceCalcInitial } from '../../models/portfolio-calculator/calculator-initial';
import { PortfolioCalculatorIntermediate, ResilienceCalcIntermediate } from '../../models/portfolio-calculator/calculator-intermediate';
import { PortfolioCalculatorFinal, ResilienceCalcFinal } from '../../models/portfolio-calculator/calculator-final';
import { deepCopy } from '../../../models/deep-copy';

interface RunCalculationParams {
    intermediateResultTransform?: (data: ResilienceCalcIntermediate) => ResilienceCalcIntermediate
}

// export interface StrategyEditParams {
//     calcParams: CalcParams;
//     outputInitial: ResilienceCalcInitial | null | undefined;
//     outputIntermediate: ResilienceCalcIntermediate | null | undefined;
//     outputFinal: ResilienceCalcFinal | null | undefined;
// }


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
    public params: ResilienceCalcData | null | undefined;
    private paramsLocal: ResilienceCalcData | null | undefined;

    @Output()
    public valueChange = new EventEmitter<CalcParams>();

    public strategyName: string | null | undefined;
    public form: FormGroup | undefined;

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
        private dp: DecimalPipe
    ) {
    }


    ngOnInit() {
        this.paramsLocal = this.params
            ? deepCopy(this.params)
            : undefined;
        this.outputInitial = this.paramsLocal?.outputInitial;
        this.outputIntermediate = this.paramsLocal?.outputIntermediate;
        this.outputFinal = this.paramsLocal?.outputFinal;
        this.setBenefitCostRatio();
        this.setStrategyName();
        this.buildForm();
        this.handleFormChanges();
    }

    private setStrategyName(): void {
        this.strategyName = this.paramsLocal
            ? getResilienceStrategyName(this.paramsLocal.calcParams.inputData.strategyType)
            : undefined;
    }

    private buildForm(): void {
        if (this.paramsLocal) {
            this.form = this.fb.group({
                name: [this.strategyName, [Validators.required, Validators.maxLength(100)]],
                discountRate: [this.paramsLocal.calcParams.inputData.discountRate * 100, [Validators.required, Validators.maxLength(50), numberValidator()]],
                lifespan: [this.paramsLocal.calcParams.inputData.lifespan, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualFixedCost: [this.paramsLocal.calcParams.inputData.annualFixedCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualOtherCost: [this.paramsLocal.calcParams.inputData.annualOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedUtilityCost: [this.paramsLocal.calcParams.inputData.avoidedUtilityCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                avoidedOtherCost: [this.paramsLocal.calcParams.inputData.avoidedOtherCost, [Validators.required, Validators.maxLength(50), numberValidator()]],
                supplyChainIndex: [this.paramsLocal.calcParams.inputData.supplyChainIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                communitySupportIndex: [this.paramsLocal.calcParams.inputData.communitySupportIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                energyIndependenceIndex: [this.paramsLocal.calcParams.inputData.energyIndependenceIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                sustainabilityIndex: [this.paramsLocal.calcParams.inputData.sustainabilityIndex, [Validators.required, Validators.maxLength(50), numberValidator()]],
                annualAvoidedCustomerCost: [this.dp.transform(this.outputIntermediate?.annualAvoidedCustomerCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                capEx: [this.dp.transform(this.outputIntermediate?.capEx ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                omCost: [this.dp.transform(this.outputIntermediate?.omCost ?? 0, '1.0-0'), [Validators.required, Validators.maxLength(50), numberValidator()]],
                customers: [this.paramsLocal.calcParams.inputData.customersAffected, [Validators.required, Validators.maxLength(50), numberValidator()]],
                outageDuration: [this.paramsLocal.calcParams.inputData.outageDuration, [Validators.required, Validators.maxLength(50), numberValidator()]],
                threatFrequency: [this.paramsLocal.calcParams.inputData.threatFrequency, [Validators.required, Validators.maxLength(50), numberValidator()]],
            });
            this.form.valueChanges.subscribe((values) => {
                console.log('formChanges', values);
            });
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
                    // this.strategyDescription = value.trim();
                }
            });
            this.subscribeToValueChanges(
                this.form.get('customers'),
                (value: number) => this.paramsLocal!.calcParams.threatData.customersAffected = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('outageDuration'),
                (value: number) => this.paramsLocal!.calcParams.inputData.outageDuration = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('threatFrequency'),
                (value: number) => this.paramsLocal!.calcParams.inputData.threatFrequency = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('lifespan'),
                (value: number) => this.paramsLocal!.calcParams.inputData.lifespan = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('discountRate'),
                (value: number) => this.paramsLocal!.calcParams.inputData.discountRate = value / 100,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('avoidedUtilityCost'),
                (value: number) => this.paramsLocal!.calcParams.inputData.avoidedUtilityCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('avoidedOtherCost'),
                (value: number) => this.paramsLocal!.calcParams.inputData.avoidedOtherCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('annualAvoidedCustomerCost'),
                (value: number) => this.outputIntermediate!.annualAvoidedCustomerCost = value,
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
                (value: number) => this.outputIntermediate!.capEx = value,
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
                (value: number) => this.outputIntermediate!.omCost = value,
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
                (value: number) => this.paramsLocal!.calcParams.inputData.annualFixedCost = value,
                () => this.runCalculations()
            );
            this.subscribeToValueChanges(
                this.form.get('annualOtherCost'),
                (value: number) => this.paramsLocal!.calcParams.inputData.annualOtherCost = value,
                () => this.runCalculations()
            );
            // no need to update the calculations on index updates
            this.subscribeToValueChanges(
                this.form.get('supplyChainIndex'),
                (value: number) => this.paramsLocal!.calcParams.inputData.supplyChainIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('communitySupportIndex'),
                (value: number) => this.paramsLocal!.calcParams.inputData.communitySupportIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('energyIndependenceIndex'),
                (value: number) => this.paramsLocal!.calcParams.inputData.energyIndependenceIndex = value
            );
            this.subscribeToValueChanges(
                this.form.get('sustainabilityIndex'),
                (value: number) => this.paramsLocal!.calcParams.inputData.sustainabilityIndex = value
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

    // private setBenefitCostRatio(): void {
    //     this.bcRatio = this.calcData?.final?.cost
    //         ? this.calcData.final.benefit / this.calcData.final.cost
    //         : undefined;
    // }

    private runCalculations(params?: RunCalculationParams): void {
        this.outputInitial = null;
        this.outputIntermediate = null;
        this.outputFinal = null;
        if (isCalcParams(this.paramsLocal?.calcParams)) {
            this.outputInitial = PortfolioCalculatorInitial.run(
                this.paramsLocal.calcParams.inputData,
                this.paramsLocal.calcParams.cdfCoeff
            );
            const intermediate = PortfolioCalculatorIntermediate.run(
                this.paramsLocal.calcParams.threatData,
                this.paramsLocal.calcParams.inputData,
                this.outputInitial
            );
            this.outputIntermediate = params?.intermediateResultTransform
                ? params.intermediateResultTransform(intermediate)
                : intermediate;
            this.outputFinal = PortfolioCalculatorFinal.run(
                this.paramsLocal.calcParams.inputData,
                this.outputIntermediate
            );
        }
        this.setBenefitCostRatio();
    }

    private setBenefitCostRatio(): void {
        this.bcRatio = this.outputFinal?.cost
            ? this.outputFinal.benefit / this.outputFinal.cost
            : undefined;
    }

}
