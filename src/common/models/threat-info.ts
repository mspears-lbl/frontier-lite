import { DisasterType } from "./disaster-type";

export interface ThreatInfo {
    id: string;
    name: string;
    disasterType: DisasterType;
}
