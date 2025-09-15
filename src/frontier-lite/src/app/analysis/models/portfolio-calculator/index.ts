import { CalcConstant, isCalcConstant } from "../calc-constants";
import { CdfCoeff, isCdfCoeff } from "../cdf-coeff";
import { ResilienceStrategyType } from "../resilience-strategy";
import { EquipmentThreatData, EquipmentThreatDataLines, isEquipmentThreatData, isEquipmentThreatDataLines } from "../threat-data";
import { isResilienceCalcFinal, PortfolioCalculatorFinal, ResilienceCalcFinal } from "./calculator-final";
import { isResilienceCalcInitial, PortfolioCalculatorInitial, ResilienceCalcInitial } from "./calculator-initial";
import { isResilienceCalcIntermediate, PortfolioCalculatorIntermediate, ResilienceCalcIntermediate } from "./calculator-intermediate";

export interface CalcParams {
    threatData: EquipmentThreatData | EquipmentThreatDataLines;
    inputData: CalcConstant;
    cdfCoeff: CdfCoeff;
}

export function isCalcParams(value: any): value is CalcParams {
    return (
        value &&
        (
            isEquipmentThreatData(value.threatData)
            ||
            isEquipmentThreatDataLines(value.threatData)
        ) &&
        isCalcConstant(value.inputData) &&
        isCdfCoeff(value.cdfCoeff)
    ) ? true : false;

}

/** The object that contains the cost/benefit calculation results. */
export interface ResilienceCalcOutput {
	initial: ResilienceCalcInitial;
	intermediate: ResilienceCalcIntermediate;
	final: ResilienceCalcFinal;
}

/** Determines if the given object is a ResilienceCalcOutput object. */
export function isResilienceCalcOutput(obj: any): obj is ResilienceCalcOutput {
	return isResilienceCalcInitial(obj.initial)
		&& isResilienceCalcIntermediate(obj.intermediate)
		&& isResilienceCalcFinal(obj.final);
}

/** The entrypoint for the cost/benefit calculations */
export class PortfolioCalculator {

	private constructor(
        private params: CalcParams
	) {
	}

	public static run(
        params: CalcParams
	): ResilienceCalcOutput {
		const obj = new PortfolioCalculator(params);
		return obj.run();
	}

	private run(): ResilienceCalcOutput {
		const initial = PortfolioCalculatorInitial.run(this.params.inputData, this.params.cdfCoeff);
		const intermediate = PortfolioCalculatorIntermediate.run(this.params.threatData, this.params.inputData, initial);
		const final = PortfolioCalculatorFinal.run(this.params.inputData, intermediate);
		return {
			initial,
			intermediate,
			final
		};
	}
}

// export interface ResilienceCalcData {
//     calcParams: CalcParams;
//     outputInitial: ResilienceCalcInitial | null | undefined;
//     outputIntermediate: ResilienceCalcIntermediate | null | undefined;
//     outputFinal: ResilienceCalcFinal | null | undefined;
// }

// export interface AddResilienceCalcData {
//     threatId: string;
//     equipmentId: string;
//     strategyType: ResilienceStrategyType;
//     data: ResilienceCalcData;
// }
