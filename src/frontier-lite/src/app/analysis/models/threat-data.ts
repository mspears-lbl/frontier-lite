import { deepCopy } from "../../models/deep-copy";
import { EquipmentType } from "../../models/equipment-type";

export interface EquipmentThreatData {
	isAffected: boolean;
	customersAffected: number;
	outageDuration: number;
}

const defaultThreatData: EquipmentThreatData = {
    isAffected: true,
    customersAffected: 200,
    outageDuration: 8
}

export function isEquipmentThreatData(value: any): value is EquipmentThreatData {
    return (
        value &&
        typeof value.isAffected === 'boolean' &&
        typeof value.customersAffected === 'number' &&
        typeof value.outageDuration === 'number'
    ) ? true : false;
}

export interface EquipmentThreatDataLines extends EquipmentThreatData {
	damageDistance: number;
	lineLength: number;
}

const defaultThreatDataLines: EquipmentThreatDataLines = {
    ...defaultThreatData,
    damageDistance: 100,
    lineLength: 100
}

export function isEquipmentThreatDataLines(value: any): value is EquipmentThreatDataLines {
    return (
        value &&
        typeof value.damageDistance === 'number' &&
        typeof value.lineLength === 'number' &&
        isEquipmentThreatData(value)
    ) ? true : false;
}

export function getThreatData(equipmentType: EquipmentType): EquipmentThreatData | EquipmentThreatDataLines {
    return equipmentType === EquipmentType.DistributionLine || equipmentType === EquipmentType.TransmissionLine
        ? deepCopy(defaultThreatDataLines)
        : deepCopy(defaultThreatData)
}
