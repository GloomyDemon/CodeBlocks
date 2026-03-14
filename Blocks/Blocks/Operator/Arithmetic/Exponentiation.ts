import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";

export class Exponentiation implements IEvaluable<number> {
    readonly id: number;
    readonly valueType: ValueType = 'number';

    constructor(
        private readonly left: IEvaluable<number>,
        private readonly right: IEvaluable<number>
    ) {
        this.id = IdGenerator.generate();
    }

    evaluate(): number {
        return this.left.evaluate() ** this.right.evaluate();
    }
}
