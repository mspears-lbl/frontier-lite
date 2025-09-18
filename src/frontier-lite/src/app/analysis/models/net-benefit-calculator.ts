import { deepCopy } from "../../models/deep-copy";
import { AnalysisProjectData } from "./analysis-project";

interface NetBenefitYear {
    year: number;
    cost: number;
    benefit: number;
    netBenefit: number;
}

interface StrategyBenefitData {
    [key: string]: NetBenefitYear[];
}

class StrategyNetBenefits {
    private data: StrategyBenefitData = {};

    public add(id: string, data: NetBenefitYear): void {
        if (!this.data[id]) {
            this.data[id] = [];
        }
        const found = this.data[id].find(item => item.year === data.year);
        if (found) {
            throw new Error(`Year ${data.year} already exists`);
        }
        this.data[id].push(data);
    }

    public getYear(id: string, year: number): NetBenefitYear {
        if (!this.data[id]) {
            throw new Error(`Strategy ${id} does not exist`);
        }
        const found = this.data[id].find(item => item.year === year);
        if (!found) {
            throw new Error(`Year ${year} does not exist`);
        }
        return found;
    }

    public getTotals(): NetBenefitYear[] {
        const results: NetBenefitYear[] = [];
        // loop through each strategy
        for (let id of Object.keys(this.data)) {
            // loop through each year
            for (let item of this.data[id]) {
                const resultItem = results.find(result => result.year === item.year);
                if (!resultItem) {
                    // create a result object for the year if it doesn't exist
                    results.push({...item});
                }
                else {
                    // otherwise add the strategy year result to the total result
                    resultItem.cost += item.cost;
                    resultItem.benefit += item.benefit;
                    resultItem.netBenefit += item.netBenefit;
                }
            }
        }
        results.sort((a, b) => a.year - b.year);
        return results;
    }
}


export class NetBenefitCalculator {
    private _data: AnalysisProjectData;

    private constructor(
        data: AnalysisProjectData
    ) {
        this._data = deepCopy(data);
    }

    public static run(data: AnalysisProjectData): NetBenefitYear[]  {
        return new NetBenefitCalculator(data).run();
    }

    private run(): NetBenefitYear[]  {
        const maxLifespan = this.getMaxLifespan();
        if (maxLifespan == null) {
            return [];
        }
        const strategyBenefits = new StrategyNetBenefits();
        // loop through each year
        for (let year = 0; year <= maxLifespan; year++) {
            for (let threat of this._data.threats || []) {
                for (let strategy of threat.strategies || []) {
                    if (year <= strategy.data.calcParams.inputData.lifespan) {
                        if (year === 0) {
                            const benefit = 0;
                            const cost = strategy.data.outputIntermediate.capEx;
                            const netBenefit = benefit - cost;
                            strategyBenefits.add(String(strategy.id), {
                                year,
                                cost,
                                benefit,
                                netBenefit
                            });
                        }
                        else {
                            const benefit = strategy.data.outputFinal.benefitSum / Math.pow(1 + strategy.data.calcParams.inputData.discountRate, year);
                            const cost = strategy.data.outputFinal.costSum /  Math.pow(1 + strategy.data.calcParams.inputData.discountRate, year);
                            const previousYear = strategyBenefits.getYear(String(strategy.id), year - 1);
                            const netBenefit = previousYear.netBenefit + (benefit - cost);
                            strategyBenefits.add(String(strategy.id), {
                                year,
                                cost,
                                benefit,
                                netBenefit
                            });
                        }
                    }
                }
            }
        }
        return strategyBenefits.getTotals();
    }

    private getMaxLifespan(): number | null | undefined {
        let maxValue: number | null | undefined = null;
        for (let threats of this._data.threats || []) {
            for (let strategy of threats.strategies || []) {
                if (maxValue == null || strategy.data.calcParams.inputData.lifespan > maxValue) {
                    maxValue = strategy.data.calcParams.inputData.lifespan;
                }
            }
        }
        return maxValue;
    }

}
