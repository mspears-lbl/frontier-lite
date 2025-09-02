import { isThreatType, ThreatType } from "../../models/threats";
import { ResilienceStrategyType } from "./resilience-strategy";

export interface AnalysisProject {
    id: string;
    name: string;
    description?: string | null | undefined;
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

export interface AddRecordResult {
    success: boolean;
    error?: any;
}

export interface ProjectThreatEquipment {
    equipmentId: string;
    strategyType: ResilienceStrategyType;
    calcConstants: any;
}

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

export interface ProjectThreat {
    id: string;
    name: string;
    description: string | null | undefined;
    threatType: ThreatType;
    equipment: ProjectThreatEquipment[];
}

export interface AnalysisProjectData extends AnalysisProject {
    threats: ProjectThreat[];
}
