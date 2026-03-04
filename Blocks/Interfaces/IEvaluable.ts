import type { IBlock } from "./IBlock.js";
export interface IEvaluable<T> extends IBlock {
    evaluate(): T;
}
