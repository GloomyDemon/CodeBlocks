import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";

export class Or implements IEvaluable<boolean> {
    readonly id: number;
    readonly valueType: ValueType = 'boolean';

    constructor(
        private readonly left: IEvaluable<boolean>,
        private readonly right: IEvaluable<boolean>
    ) {
        this.id = IdGenerator.generate();
    }

    evaluate(): boolean {
        return this.left.evaluate() || this.right.evaluate();
    }
}
