import { deepCopy } from "../../models/deep-copy";
import { ResilienceStrategyType } from "./resilience-strategy";

export interface CalcConstant {
    strategyType: ResilienceStrategyType;
    lifespan: number;
    outageDuration: number;
    customersAffected: number;
    residential: number;
    smnr: number;
    lnr: number;
    public: number;
    discountRate: number;
    threatFrequency: number;
    outageLengthDelta: number;
    outageLikelihoodDelta: number;
    capExValue: number | null;
    capExFactor: number | null;
    omValue: number | null;
    omFactor: number | null;
	annualFixedCost: number;
	annualOtherCost: number;
	avoidedUtilityCost: number;
	avoidedOtherCost: number;
	supplyChainIndex: number;
	communitySupportIndex: number;
	energyIndependenceIndex: number;
	sustainabilityIndex: number;
}

export function isCalcConstant(value: any): value is CalcConstant {
    return (
        value &&
        typeof value.strategyType === 'number' &&
        typeof value.lifespan === 'number' &&
        typeof value.outageDuration === 'number' &&
        typeof value.customersAffected === 'number' &&
        typeof value.residential === 'number' &&
        typeof value.smnr === 'number' &&
        typeof value.lnr === 'number' &&
        typeof value.public === 'number' &&
        typeof value.discountRate === 'number' &&
        typeof value.threatFrequency === 'number' &&
        typeof value.outageLengthDelta === 'number' &&
        typeof value.outageLikelihoodDelta === 'number' &&
        (typeof value.capExValue === 'number' || value.capExValue === null) &&
        (typeof value.capExFactor === 'number' || value.capExFactor === null) &&
        (typeof value.omValue === 'number' || value.omValue === null) &&
        (typeof value.omFactor === 'number' || value.omFactor === null) &&
        typeof value.annualFixedCost === 'number' &&
        typeof value.annualOtherCost === 'number' &&
        typeof value.avoidedUtilityCost === 'number' &&
        typeof value.avoidedOtherCost === 'number' &&
        typeof value.supplyChainIndex === 'number' &&
        typeof value.communitySupportIndex === 'number' &&
        typeof value.energyIndependenceIndex === 'number' &&
        typeof value.sustainabilityIndex === 'number'
    ) ? true : false;
}

// , annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5

export const calcConstants: CalcConstant[] = [
    { strategyType: ResilienceStrategyType.RelocateVulnerableLines, lifespan: 70, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -100, capExValue: null, capExFactor: 38.82575758, omValue: 0, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.ConvertWoodPolesToConcrete, lifespan: 70, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -8, capExValue: null, capExFactor: 140, omValue: null, omFactor: 1.4, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.BracingPolesGuyWiresAndPoleFoam, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -10, capExValue: null, capExFactor: 2.5, omValue: null, omFactor: 1.4, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.PreStagingTransmissionEquipment, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: -50, outageLikelihoodDelta: 0, capExValue: null, capExFactor: 100, omValue: 0, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.ReinforceSubstations, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -70, capExValue: 3200000, capExFactor: null, omValue: 100, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.BuildNewSubstationsRelocated, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -100, capExValue: 4000000, capExFactor: null, omValue: 0, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.PurchaseMobileSubstations, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: -100, outageLikelihoodDelta: 0, capExValue: 2500000, capExFactor: null, omValue: 10000, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.PreStagingSubstationEquipment, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: -50, outageLikelihoodDelta: 0, capExValue: 300000, capExFactor: null, omValue: 0, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.RelocateGeneration, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -100, capExValue: 63000, capExFactor: null, omValue: 0, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.ReinforceGeneration, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: 0, outageLikelihoodDelta: -70, capExValue: 3200000, capExFactor: null, omValue: 100, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5},
    { strategyType: ResilienceStrategyType.PreStagingGenerationEquipment, lifespan: 25, outageDuration: 7, customersAffected: 200, residential: 68, smnr: 23, lnr: 2, public: 7, discountRate: 0.1, threatFrequency: 5, outageLengthDelta: -50, outageLikelihoodDelta: 0, capExValue: 300000, capExFactor: null, omValue: 0, omFactor: null, annualFixedCost: 0, annualOtherCost: 0, avoidedUtilityCost: 0, avoidedOtherCost: 0, supplyChainIndex: 5, communitySupportIndex: 5, energyIndependenceIndex: 5, sustainabilityIndex: 5}
];

export function getResilienceStrategyConstants(strategyType: ResilienceStrategyType): CalcConstant {
    const found = calcConstants.find(item => item.strategyType === strategyType);
    if (!found) {
        throw new Error(`Unknown strategy type (${strategyType})`);
    }
    return deepCopy(found);
}
