export const amazon: typeof import("./amazon");
export const google: typeof import("./google");
export function getExecutingPlatform(first: any, second: any, ...rest: Array<any> | any): 'google'|'amazon';
export function universalSoak(func: (first: any, second: any, ...rest: Array<any> | any) => any, soakConfig: any): any;