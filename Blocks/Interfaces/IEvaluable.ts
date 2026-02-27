import type { IValue } from "./IValue.ts";

export interface IEvaluable<T> extends IValue {
    evaluate(): T;
}
