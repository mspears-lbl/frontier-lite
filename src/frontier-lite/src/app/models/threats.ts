import { AppList, getAppListNameById } from "./app-list";

export enum ThreatType {
    WaterInundation=1,
    PeakGroundAcceleration=2,
    PeakGroundVelocity=3,
    SoilLiquefactionSusceptibility=4,
    Wind=5,
    Wildfire=6,
    Other=7,
}

export function isThreatType(value: number): value is ThreatType {
    return Object.values(ThreatType).includes(value);
}

export const threatTypeList: AppList<ThreatType> = [
    {id: ThreatType.WaterInundation, name: 'Water Inundation'},
    {id: ThreatType.PeakGroundAcceleration, name: 'Peak Ground Acceleration'},
    {id: ThreatType.PeakGroundVelocity, name: 'Peak Ground Velocity'},
    {id: ThreatType.SoilLiquefactionSusceptibility, name: 'Soil Liquefaction Susceptibility'},
    {id: ThreatType.Wind, name: 'Wind'},
    {id: ThreatType.Wildfire, name: 'Wildfire'},
    {id: ThreatType.Other, name: 'Other'},
]

export function getThreatName(value: ThreatType): string {
    return getAppListNameById(threatTypeList, value);
}

interface ThreatIcon {
    threatType: ThreatType;
    icon: string;
}

const threatIcons: ThreatIcon[] = [
    {threatType: ThreatType.WaterInundation, icon: 'water'},
    {threatType: ThreatType.PeakGroundAcceleration, icon: 'motion_blur'},
    {threatType: ThreatType.PeakGroundVelocity, icon: 'speed'},
    {threatType: ThreatType.SoilLiquefactionSusceptibility, icon: 'landslide'},
    {threatType: ThreatType.Wind, icon: 'air'},
    {threatType: ThreatType.Wildfire, icon: 'local_fire_department'},
    {threatType: ThreatType.Other, icon: 'globe'},
]

export function getThreatIcon(value: ThreatType): string {
    const found = threatIcons.find(item => item.threatType === value);
    if (!found) {
        throw new Error(`Unknown ThreatType ${value}`);
    }
    return found.icon;
}
