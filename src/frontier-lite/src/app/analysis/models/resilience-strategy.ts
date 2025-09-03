import { AppList, getAppListNameById } from "../../models/app-list";
import { EquipmentType } from "../../models/equipment-type";

export enum ResilienceStrategyType {
	RelocateVulnerableLines=1,
	ConvertWoodPolesToConcrete=2,
	BracingPolesGuyWiresAndPoleFoam=3,
	PreStagingTransmissionEquipment=4,
	ReinforceSubstations=5,
	BuildNewSubstationsRelocated=6,
	PurchaseMobileSubstations=7,
	PreStagingSubstationEquipment=8,
	RelocateGeneration=9,
	ReinforceGeneration=10,
	PreStagingGenerationEquipment=11
}

/** Determines if the given object is a valid ResilienceStrategyType */
export function isResilienceStrategyType(value: any): value is ResilienceStrategyType {
	return typeof value === 'number' && value in ResilienceStrategyType
		? true : false;
}

export const resilienceStrategyList: AppList<ResilienceStrategyType> = [
	{ id:  ResilienceStrategyType.RelocateVulnerableLines , name: 'Relocate vulnerable lines'},
	{ id:  ResilienceStrategyType.ConvertWoodPolesToConcrete , name: 'Convert wood poles to concrete'},
	{ id:  ResilienceStrategyType.BracingPolesGuyWiresAndPoleFoam , name: 'Bracing poles (Guy wires and Pole foam)'},
	{ id:  ResilienceStrategyType.PreStagingTransmissionEquipment , name: 'Prestaging transmission equipment'},
	{ id:  ResilienceStrategyType.ReinforceSubstations , name: 'Reinforce substations'},
	{ id:  ResilienceStrategyType.BuildNewSubstationsRelocated , name: 'Build new substations relocated'},
	{ id:  ResilienceStrategyType.PurchaseMobileSubstations , name: 'Purchase mobile substations'},
	{ id:  ResilienceStrategyType.PreStagingSubstationEquipment , name: 'Prestaging substation equipment'},
	{ id:  ResilienceStrategyType.RelocateGeneration , name: 'Relocate generation'},
	{ id:  ResilienceStrategyType.ReinforceGeneration , name: 'Reinforce generation'},
	{ id:  ResilienceStrategyType.PreStagingGenerationEquipment , name: 'Prestaging generation equipment'},
];

export interface StrategyEquipmentData {
	resilienceStrategy: ResilienceStrategyType;
	equipmentType: EquipmentType;
}

export const strategyEquipmentList: StrategyEquipmentData[] = [
	{ resilienceStrategy: ResilienceStrategyType.RelocateVulnerableLines, equipmentType: EquipmentType.DistributionLine },
	{ resilienceStrategy: ResilienceStrategyType.ConvertWoodPolesToConcrete, equipmentType: EquipmentType.DistributionLine },
	{ resilienceStrategy: ResilienceStrategyType.BracingPolesGuyWiresAndPoleFoam, equipmentType: EquipmentType.DistributionLine },
	{ resilienceStrategy: ResilienceStrategyType.PreStagingTransmissionEquipment, equipmentType: EquipmentType.DistributionLine },
	{ resilienceStrategy: ResilienceStrategyType.ReinforceSubstations, equipmentType: EquipmentType.Substation },
	{ resilienceStrategy: ResilienceStrategyType.BuildNewSubstationsRelocated, equipmentType: EquipmentType.Substation },
	{ resilienceStrategy: ResilienceStrategyType.PurchaseMobileSubstations, equipmentType: EquipmentType.Substation },
	{ resilienceStrategy: ResilienceStrategyType.PreStagingSubstationEquipment, equipmentType: EquipmentType.Substation },
	{ resilienceStrategy: ResilienceStrategyType.RelocateGeneration, equipmentType: EquipmentType.GenerationAsset },
	{ resilienceStrategy: ResilienceStrategyType.ReinforceGeneration, equipmentType: EquipmentType.GenerationAsset },
	{ resilienceStrategy: ResilienceStrategyType.PreStagingGenerationEquipment, equipmentType: EquipmentType.GenerationAsset },
];

export function getStrategiesForEquipment(equipmentType: EquipmentType): ResilienceStrategyType[] {
	return strategyEquipmentList
		.filter(item => item.equipmentType === equipmentType)
		.map(item => item.resilienceStrategy);
}

export function getResilienceStrategyName(id: ResilienceStrategyType): string {
    return getAppListNameById(resilienceStrategyList, id)
}
