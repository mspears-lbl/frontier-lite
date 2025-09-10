import { CalcConstant } from "../calc-constants";
import { isEquipmentThreatDataLines, EquipmentThreatData, EquipmentThreatDataLines } from "../threat-data";
import { ResilienceCalcInitial } from "./calculator-initial";

export interface ResilienceCalcIntermediate {
	annualAvoidedCustomerCost: number;
	capEx: number;
	omCost: number;
}

export function isResilienceCalcIntermediate(obj: any): obj is ResilienceCalcIntermediate {
	return typeof obj.annualAvoidedCustomerCost === 'number'
		&& typeof  obj.capEx === 'number'
		&& typeof obj.omCost === 'number';
}

export class PortfolioCalculatorIntermediate {

	private constructor(
		private threatData: EquipmentThreatData | EquipmentThreatDataLines,
		private inputData: CalcConstant,
		private calcInitial: ResilienceCalcInitial
	) {
	}

	public static run(
		threatData: EquipmentThreatData | EquipmentThreatDataLines,
		inputData: CalcConstant,
		calcInitial: ResilienceCalcInitial
	): ResilienceCalcIntermediate {
		const obj = new PortfolioCalculatorIntermediate(threatData, inputData, calcInitial);
		return obj.run();
	}

	private run(): ResilienceCalcIntermediate {
		const annualAvoidedCustomerCost = this.getAnnualAvoidedCost();
		const capEx = this.getCapEx();
		const omCost = this.getOmCost();
		return {
			annualAvoidedCustomerCost,
			capEx,
			omCost
		}
	}

	private getAnnualAvoidedCost(): number {
		return this.calcInitial.avoidedResidentialCost + this.calcInitial.avoidedSmnrCost + this.calcInitial.avoidedLnrCost + this.calcInitial.avoidedPublicCost;
	}

	private getCapEx(): number {
		if (
			typeof this.inputData.capExFactor !== 'number'
			&& typeof this.inputData.capExValue === 'number'
		) {
			return this.inputData.capExValue;
		}
		else if (
			typeof this.inputData.capExValue !== 'number'
			&& typeof this.inputData.capExFactor === 'number'
			&& isEquipmentThreatDataLines(this.threatData)
			&& typeof this.threatData.lineLength === 'number'
		) {
			return this.inputData.capExFactor * this.threatData.lineLength;
		}
		else {
			throw new Error('Unable to calculate capEx, invalid parameters');
		}
	}

	private getOmCost(): number {
		if (
			typeof this.inputData.omFactor !== 'number'
			&& typeof this.inputData.omValue === 'number'
		) {
			return this.inputData.omValue;
		}
		else if (
			typeof this.inputData.omValue !== 'number'
			&& typeof this.inputData.omFactor === 'number'
			&& isEquipmentThreatDataLines(this.threatData)
			&& typeof this.threatData.lineLength === 'number'
		) {
			return this.inputData.omFactor * this.threatData.lineLength;
		}
		else {
			throw new Error('Unable to calculate om, invalid parameters');
		}
	}

}
