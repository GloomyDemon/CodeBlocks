import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";

export class LessOrEqual<T extends number | string> implements IEvaluable<boolean> {
    readonly id: number;
    readonly valueType: ValueType = 'boolean';

    constructor(
        private readonly left: IEvaluable<T>,
        private readonly right: IEvaluable<T>
    ) {
        this.id = IdGenerator.generate();
    }

    evaluate(): boolean {
        return this.left.evaluate() <= this.right.evaluate();
    }
}
