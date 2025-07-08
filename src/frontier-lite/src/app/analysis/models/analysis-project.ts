
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
