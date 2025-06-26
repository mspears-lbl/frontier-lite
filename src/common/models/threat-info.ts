import { DisasterType } from "./disaster-type";

export interface ThreatInfo {
    id: number;
    name: string;
    disasterType: DisasterType;
}
