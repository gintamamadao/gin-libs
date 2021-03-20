type AnyFunction = (...args: any[]) => any;

export const isString = (v: any): v is string => {
  return typeof v === "string";
};

export const isFinite = (v: any): boolean => {
  return v !== Infinity && v !== -Infinity;
};

export const isNumber = (v: any): v is number => {
  return typeof v === "number" && !Number.isNaN(v) && isFinite(v);
};

export const isUndefined = (v: any): v is undefined => {
  return typeof v === "undefined";
};

export const isBoolean = (v: any): v is boolean => {
  return !!v === v;
};

export const isObject = <T = Record<string, unknown>>(v: any): v is T => {
  return Object.prototype.toString.call(v) === "[object Object]";
};

export const isArray = <T = any[]>(v: any): v is T => {
  return Array.isArray(v);
};

export const isNilVal = (v: any, ...args: any[]): v is undefined | null => {
  args.push(v);
  return args.every((val) => val === undefined || val === null);
};

export const isDate = (v: any): v is Date => {
  return Object.prototype.toString.call(v) === "[object Date]";
};

export const isFunc = <T = AnyFunction>(v: any): v is T => {
  return typeof v === "function";
};

export const isPromise = <T = Promise<any>>(v: any): v is T => {
  return v && isFunc(v.then);
};
