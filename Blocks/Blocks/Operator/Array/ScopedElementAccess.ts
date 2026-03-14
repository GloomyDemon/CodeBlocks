import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";
import { Scope } from "../../../Program/Scope.js";
import { ArrayVariable } from "../../ArrayVariable.js";

export class ScopedElementAccess<T> implements IEvaluable<T> {
    readonly id: number;
    readonly valueType: ValueType;

    constructor(
        private readonly arrayName: string,
        private readonly index: IEvaluable<number>,
        private readonly scope: Scope,
        elementType: ValueType = 'number'
    ) {
        this.id = IdGenerator.generate();
        this.valueType = elementType;
    }

    evaluate(): T {
        const resolved = this.scope.get(this.arrayName);
        if (!resolved || !(resolved instanceof ArrayVariable)) {
            throw new Error(`Array "${this.arrayName}" is not declared.`);
        }
        return resolved.getElement(this.index.evaluate()) as T;
    }
}
