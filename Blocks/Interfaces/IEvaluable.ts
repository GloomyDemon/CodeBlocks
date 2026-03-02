import type { IValue } from "./IValue.js";

export interface IEvaluable<T> extends IValue {
    evaluate(): T;
}
