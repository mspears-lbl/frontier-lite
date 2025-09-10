import { CalcConstant } from "../calc-constants";
import { ResilienceCalcIntermediate } from "./calculator-intermediate";

export interface ResilienceCalcFinal {
	benefitSum: number;
	costSum: number;
	benefit: number;
	cost: number;
}

export function isResilienceCalcFinal(obj: any): obj is ResilienceCalcFinal {
	return typeof obj.benefit === 'number'
		&& typeof obj.benefitSum === 'number'
		&& typeof obj.cost === 'number'
		&& typeof obj.costSum === 'number';
}

export class PortfolioCalculatorFinal {

	private constructor(
		private inputData: CalcConstant,
		private calcIntermediate: ResilienceCalcIntermediate
	) {
	}

	public static run(
		inputData: CalcConstant,
		calcIntermediate: ResilienceCalcIntermediate
	): ResilienceCalcFinal {
		const obj = new PortfolioCalculatorFinal(inputData, calcIntermediate);
		return obj.run();
	}

	private run(): ResilienceCalcFinal {
		const costSum = this.getCostSum();
		const benefitSum = this.getBenefitSum();
		const cost = this.getCost(costSum);
		const benefit = this.getBenefit(benefitSum);
		return {
			costSum,
			benefitSum,
			cost,
			benefit
		}
	}

	private getCostSum(): number {
		return this.calcIntermediate.omCost
			+ this.inputData.annualFixedCost
			+ this.inputData.annualOtherCost;
	}

	private getBenefitSum(): number {
		return this.calcIntermediate.annualAvoidedCustomerCost
			+ this.inputData.avoidedUtilityCost
			+ this.inputData.avoidedOtherCost;
	}

	private getBenefit(benefitSum: number): number {
		return benefitSum * (
			(
				1 - (
					1 / (
						Math.pow(
							1 + (this.inputData.discountRate),
							this.inputData.lifespan
						)
					)
				)
			)
			/
			(
				this.inputData.discountRate
			)
		);
	}

	private getCost(costSum: number): number {
		return this.calcIntermediate.capEx + (
			costSum * (
				(
					1 - (
						1 / (
							Math.pow(
								1 + (this.inputData.discountRate),
								this.inputData.lifespan
							)
						)
					)
				)
				/ (
					this.inputData.discountRate
				)
			)
		);
	}

}
