import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";
import { ArrayVariable } from "../../ArrayVariable.js";

export class ElementAccess<T> implements IEvaluable<T> {
    readonly id: number;
    readonly valueType: ValueType;

    constructor(
        private readonly array: ArrayVariable<T>,
        private readonly index: IEvaluable<number>
    ) {
        this.id = IdGenerator.generate();
        this.valueType = array.elementType;
    }

    evaluate(): T {
        const indexValue = this.index.evaluate();
        return this.array.getElement(indexValue);
    }
}
