import type { IBlock } from "./IBlock.ts";
import type { ValueType } from "../Program/ValueType.ts";
export interface IEvaluable<T> extends IBlock {
    readonly valueType: ValueType;
    evaluate(): T;
}
