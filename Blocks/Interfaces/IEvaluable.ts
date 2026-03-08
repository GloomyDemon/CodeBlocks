import type { IBlock } from "./IBlock.ts";
export interface IEvaluable<T> extends IBlock {
    evaluate(): T;
}
