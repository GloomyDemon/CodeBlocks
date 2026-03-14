import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";
import type { Variable } from "../../Variable.js";

export class Decrement implements IEvaluable<number> {
    readonly id: number;
    readonly valueType: ValueType = 'number';

    constructor(private readonly target: Variable<number>) {
        this.id = IdGenerator.generate();
    }

    evaluate(): number {
        const nextValue = this.target.evaluate() - 1;
        this.target.change(nextValue);
        return nextValue;
    }
}
