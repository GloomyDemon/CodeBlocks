import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { ValueType } from "../../Program/ValueType.js";

export class Ternary<T> implements IEvaluable<T> {
    readonly id: number;
    readonly valueType: ValueType;

    constructor(
        private readonly condition: IEvaluable<boolean>,
        private readonly whenTrue: IEvaluable<T>,
        private readonly whenFalse: IEvaluable<T>
    ) {
        this.id = IdGenerator.generate();
        this.valueType = whenTrue.valueType;
    }

    evaluate(): T {
        return this.condition.evaluate() ? this.whenTrue.evaluate() : this.whenFalse.evaluate();
    }
}
