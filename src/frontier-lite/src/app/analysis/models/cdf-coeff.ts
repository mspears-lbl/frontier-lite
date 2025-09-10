import { deepCopy } from "../../models/deep-copy";

export interface CdfCoeffAB {
    a: number;
    b: number;
}

export function isCdfCoeffAB(obj: any): obj is CdfCoeffAB {
    return (
        typeof obj?.a === 'number'
        && typeof obj.b === 'number'
    ) ? true : false;
}

export interface CdfCoeffXYZ {
    x: number;
    y: number;
    z: number;
}

export function isCdfCoeffXYZ(obj: any): obj is CdfCoeffXYZ {
    return (
        typeof obj?.x === 'number'
        && typeof obj.y === 'number'
        && typeof obj.z === 'number'
    ) ? true : false;
}

export function calculateWithCdf(coeff: CdfCoeffAB | CdfCoeffXYZ, t: number): number {
    if (isCdfCoeffAB(coeff)) {
        return Math.pow(coeff.a + coeff.b * t, 2);
    }
    else if (isCdfCoeffXYZ(coeff)) {
        return coeff.x + coeff.y * t + coeff.z * t * t;
    }
    else {
        throw new Error('Invalid CDF format')
    }
}

export interface CdfCoeff {
    residential: CdfCoeffAB | CdfCoeffXYZ;
    smnr: CdfCoeffAB | CdfCoeffXYZ;
    lnr: CdfCoeffAB | CdfCoeffXYZ;
    public: CdfCoeffAB | CdfCoeffXYZ;
}

export function isCdfCoeff(value: any): value is CdfCoeff {
    return (
        (isCdfCoeffAB(value.residential) || isCdfCoeffXYZ(value.residential)) &&
        (isCdfCoeffAB(value.smnr) || isCdfCoeffXYZ(value.smnr)) &&
        (isCdfCoeffAB(value.lnr) || isCdfCoeffXYZ(value.lnr)) &&
        (isCdfCoeffAB(value.public) || isCdfCoeffXYZ(value.public))
    ) ? true : false;
}

const cdfCoeff1: CdfCoeff = {
    residential: {x: 19.0, y: 1.7, z: 0.0022},
    smnr: {a: 56.0, b: 0.78},
    lnr: {a: 54.0, b: 0.84},
    public: {x: 7500, y: 130.0, z: 1.4}
}

const cdfCoef2: CdfCoeff = {
    residential: {a: 3.2, b: 0.092},
    smnr: {a: 25, b: 0.54},
    lnr: {a: 110, b: 2.1},
    public: {a: 79.0, b: 1.6}
}

const cdfCoef3: CdfCoeff = {
    residential: {a: 4.8, b: 0.044},
    smnr: {a: 63, b: 0.64},
    lnr: {a: 210, b: 3.4},
    public: {a: 75.0, b: 3.2}
}

export function getCdfCoeff(): CdfCoeff {
    return deepCopy(cdfCoeff1);
}
