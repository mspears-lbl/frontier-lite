import { isThreatType, ThreatType } from "../../models/threats";
import { CalcParams, isCalcParams } from "./portfolio-calculator";
import { isResilienceCalcFinal, ResilienceCalcFinal } from "./portfolio-calculator/calculator-final";
import { isResilienceCalcInitial, ResilienceCalcInitial } from "./portfolio-calculator/calculator-initial";
import { isResilienceCalcIntermediate, ResilienceCalcIntermediate } from "./portfolio-calculator/calculator-intermediate";
import { isResilienceStrategyType, ResilienceStrategyType } from "./resilience-strategy";

export interface ProjectCalcResults {
    cost: number;
    benefit: number;
    benefitCost: number | null | undefined;
}


export interface AnalysisProject {
    id: string;
    name: string;
    description?: string | null | undefined;
    calc?: ProjectCalcResults | null | undefined;
    created: Date;
}

export interface AddAnalysisProjectParams {
    name: string;
    description?: string | null | undefined;
}

export function isAddAnalysisProjectParams(value: any): value is AddAnalysisProjectParams {
    return (
        value &&
        value.name &&
        typeof value.name === 'string'
    );
}

export interface UpdateAnalysisProjectParams {
    id: string;
    name: string;
    description?: string | null | undefined;
}

export interface AddRecordResult {
    success: boolean;
    error?: any;
}

// export interface ProjectThreatEquipment {
//     equipmentId: string;
//     strategyType: ResilienceStrategyType;
//     calcConstants: any;
// }

export interface AddProjectThreatRequest {
    projectId: string;
    name: string;
    description: string | null | undefined;
    threatType: ThreatType;
}

export function isAddProjectThreatRequest(value: any): value is AddProjectThreatRequest {
    return (
        value &&
        value.projectId &&
        typeof value.projectId === 'string' &&
        value.name &&
        typeof value.name === 'string' &&
        value.threatType &&
        isThreatType(value.threatType)
    );
}

export interface ThreatStrategyData {
    calcParams: CalcParams;
	outputInitial: ResilienceCalcInitial;
	outputIntermediate: ResilienceCalcIntermediate;
	outputFinal: ResilienceCalcFinal;
}

export function isThreatStrategyData(value: any): value is ThreatStrategyData {
    return (
        value &&
        value.calcParams &&
        isCalcParams(value.calcParams) &&
        value.outputInitial &&
        isResilienceCalcInitial(value.outputInitial) &&
        value.outputIntermediate &&
        isResilienceCalcIntermediate(value.outputIntermediate) &&
        value.outputFinal &&
        isResilienceCalcFinal(value.outputFinal)
    );
}

export interface ThreatStrategyDataEdit {
    calcParams: CalcParams;
	outputInitial: ResilienceCalcInitial | null | undefined;
	outputIntermediate: ResilienceCalcIntermediate | null | undefined;
	outputFinal: ResilienceCalcFinal | null | undefined;
}

export interface ProjectThreatStrategy {
    id: number;
    name: string;
    equipmentId: string;
    strategyType: ResilienceStrategyType;
    data: ThreatStrategyData;
}

export interface EditProjectThreatStrategyParams {
    threatId: string;
    name: string | null | undefined;
    equipmentId: string;
    strategyType: ResilienceStrategyType;
    data: ThreatStrategyDataEdit;
}

export interface AddProjectThreatStrategyParams {
    threatId: string;
    name: string;
    equipmentId: string;
    strategyType: ResilienceStrategyType;
    data: ThreatStrategyData;
}

export function isAddProjectThreatStrategyParams(value: any): value is AddProjectThreatStrategyParams {
    return (
        value &&
        value.threatId &&
        typeof value.threatId === 'string' &&
        value.name &&
        typeof value.name === 'string' &&
        value.equipmentId &&
        typeof value.equipmentId === 'string' &&
        value.strategyType &&
        isResilienceStrategyType(value.strategyType) &&
        value.data &&
        typeof value.data === 'object'
    );
}

export interface ProjectThreat {
    id: string;
    name: string;
    description: string | null | undefined;
    threatType: ThreatType;
    // equipment: ProjectThreatEquipment[];
    strategies: ProjectThreatStrategy[] | null | undefined;
}

export interface AnalysisProjectData extends AnalysisProject {
    threats: ProjectThreat[];
}

export interface ProjectThreatUpdateParams {
    id: string;
    name: string;
    description: string | null | undefined;
    threatType: ThreatType;
}

export function isProjectThreatUpdateParams(value: any): value is ProjectThreatUpdateParams {
    return (
        value &&
        value.id &&
        typeof value.id === 'string' &&
        value.name &&
        typeof value.name === 'string' &&
        value.threatType &&
        isThreatType(value.threatType)
    );
}
