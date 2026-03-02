import type { IEvaluable } from "./IEvaluable.js";
import type { IBlock } from "./IBlock.js";

export interface IConditional extends IBlock {
    condition: IEvaluable<boolean>;
    check(): boolean;
}
