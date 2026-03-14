import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";
import { ArrayVariable } from "../../ArrayVariable.js";

export class ArrayLength implements IEvaluable<number> {
    readonly id: number;
    readonly valueType: ValueType = 'number';

    constructor(private readonly array: ArrayVariable<unknown>) {
        this.id = IdGenerator.generate();
    }

    evaluate(): number {
        return this.array.length();
    }
}
