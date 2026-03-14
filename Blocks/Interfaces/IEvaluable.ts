import type { IBlock } from "./IBlock.js";
import type { ValueType } from "../Program/ValueType.js";
export interface IEvaluable<T> extends IBlock {
    readonly valueType: ValueType;
    evaluate(): T;
}
