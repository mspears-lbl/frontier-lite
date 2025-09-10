import { CalcConstant } from "../calc-constants";
import { calculateWithCdf, CdfCoeff } from "../cdf-coeff";

export interface ResilienceCalcInitial {
	baselineOutageFrequency: number;
	updatedOutageFrequency: number;
	updatedOutageLength: number;
	reducedOutage: number;
	avoidedResidentialCost: number;
	avoidedSmnrCost: number;
	avoidedLnrCost: number;
	avoidedPublicCost: number;
}

export function isResilienceCalcInitial(obj: any): obj is ResilienceCalcInitial {
	return typeof obj.baselineOutageFrequency === 'number'
		&& typeof obj.updatedOutageFrequency === 'number'
		&& typeof obj.updatedOutageLength === 'number'
		&& typeof obj.reducedOutage === 'number'
		&& typeof obj.avoidedResidentialCost === 'number'
		&& typeof obj.avoidedSmnrCost === 'number'
		&& typeof obj.avoidedLnrCost === 'number'
		&& typeof obj.avoidedPublicCost === 'number';
}

export class PortfolioCalculatorInitial {

	private constructor(
		private inputData: CalcConstant,
		private cdfCoeff: CdfCoeff
	) {
	}

	public static run(
		inputData: CalcConstant,
		cdfCoeff: CdfCoeff
	): ResilienceCalcInitial {
		const obj = new PortfolioCalculatorInitial(inputData, cdfCoeff);
		return obj.run();
	}

	private run(): ResilienceCalcInitial {
		const baselineOutageFrequency = this.getBaselineOutageFrequency();
		const updatedOutageLength = this.getUpdatedOutageLength();
		const updatedOutageFrequency = this.getUpdatedOutageFrequency(baselineOutageFrequency);
		const reducedOutage = this.getReducedOutage(baselineOutageFrequency, updatedOutageLength, updatedOutageFrequency);
		const avoidedResidentialCost = this.getAvoidedResidentialCost(reducedOutage);
		const avoidedSmnrCost = this.getAvoidedSmnrCost(reducedOutage);
		const avoidedLnrCost = this.getAvoidedLnrCost(reducedOutage);
		const avoidedPublicCost = this.getAvoidedPublicCost(reducedOutage);
		return {
			baselineOutageFrequency,
			updatedOutageFrequency,
			updatedOutageLength,
			reducedOutage,
			avoidedResidentialCost,
			avoidedSmnrCost,
			avoidedLnrCost,
			avoidedPublicCost,
		}
	}

	private getBaselineOutageFrequency(): number {
		return this.inputData.lifespan * (this.inputData.threatFrequency / 100);
	}

	private getUpdatedOutageLength(): number {
		return (1 + (this.inputData.outageLengthDelta / 100)) * this.inputData.outageDuration;
	}

	private getUpdatedOutageFrequency(baselineOutageFrequency: number): number {
		return (1 + (this.inputData.outageLikelihoodDelta/ 100)) * baselineOutageFrequency;
	}

	private getReducedOutage(
		baselineOutageFrequency: number,
		updatedOutageLength: number,
		updatedOutageFrequency: number
	): number {
		return (baselineOutageFrequency * this.inputData.outageDuration)
			- (updatedOutageLength * updatedOutageFrequency);
	}

	private getAvoidedResidentialCost(
		reducedOutage: number
	): number {
		return calculateWithCdf(this.cdfCoeff.residential, reducedOutage);
	}

	private getAvoidedSmnrCost(
		reducedOutage: number
	): number {
		return calculateWithCdf(this.cdfCoeff.smnr, reducedOutage);
	}

	private getAvoidedLnrCost(
		reducedOutage: number
	): number {
		return calculateWithCdf(this.cdfCoeff.lnr, reducedOutage);
	}

	private getAvoidedPublicCost(
		reducedOutage: number
	): number {
		return calculateWithCdf(this.cdfCoeff.public, reducedOutage);
	}

}
