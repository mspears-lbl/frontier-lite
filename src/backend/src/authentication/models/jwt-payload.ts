
export interface JwtPayload {
    uuid: string;
    exp: number;
}

export function isJwtPayload(obj: any): obj is JwtPayload {
    return typeof obj?.uuid === 'string'
        && typeof obj.exp === 'number'
        ? true : false;
}
