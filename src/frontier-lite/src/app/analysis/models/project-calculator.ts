import { ProjectCalcResults, ProjectThreat } from "./analysis-project";

export class ProjectCalculator {

    private constructor(
        private threats: ProjectThreat[]
    ) {

    }

    public static run(threats: ProjectThreat[]): ProjectCalcResults {
        const obj = new ProjectCalculator(threats);
        return obj.run();
    }

    private run(): ProjectCalcResults {
        let cost = 0;
        let benefit = 0;
        for (let threat of this.threats) {
            for (let strategy of threat.strategies || []) {
                benefit += strategy.data.outputFinal.benefit;
                cost += strategy.data.outputFinal.cost;
            }
        }
        const benefitCost = cost != 0
            ? benefit / cost
            : null;
        return {
            benefitCost,
            benefit,
            cost
        };
    }

}
