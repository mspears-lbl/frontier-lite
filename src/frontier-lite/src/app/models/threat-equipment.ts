import { CalcConstant } from "../analysis/models/calc-constants";
import { ResilienceStrategyType } from "../analysis/models/resilience-strategy";

export interface ResilienceStrategyConstant {
    strategy: ResilienceStrategyType;
    name: string;
    constants: CalcConstant;
}

export interface AddThreatEquipmentParams {
    projectThreatId: string;
    equipmentId: string;
    strategies: ResilienceStrategyConstant[];
}
