import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";

export class Addition<T extends number | string> implements IEvaluable<T> {
    readonly id: number;
    readonly valueType: ValueType;

    constructor(
        private readonly left: IEvaluable<T>,
        private readonly right: IEvaluable<T>
    ) {
        this.id = IdGenerator.generate();
        this.valueType = left.valueType;
    }

    evaluate(): T {
        const leftVal = this.left.evaluate();
        const rightVal = this.right.evaluate();

        if (typeof leftVal === 'number' && typeof rightVal === 'number') {
            return (leftVal + rightVal) as T;
        }

        return (String(leftVal) + String(rightVal)) as T;
    }
}
