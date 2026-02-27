import type { IEvaluable } from "./IEvaluable.ts";
import type { IBlock } from "./IBlock.ts";
export interface IConditional extends IBlock {
    condition: IEvaluable<boolean>;
    check(): boolean;
}
//# sourceMappingURL=IConditional.d.ts.map