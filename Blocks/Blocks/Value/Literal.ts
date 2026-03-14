import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { ValueType } from "../../Program/ValueType.js";

export class Literal<T> implements IEvaluable<T> {
    readonly id: number;
    readonly valueType: ValueType;

    constructor(private readonly value: T, valueType: ValueType) {
        this.id = IdGenerator.generate();
        this.valueType = valueType;
    }

    evaluate(): T {
        return this.value;
    }
}
