import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { ValueType } from "../../Program/ValueType.js";
import { Scope } from "../../Program/Scope.js";
import { Variable } from "../Variable.js";

export class VariableReference<T> implements IEvaluable<T> {
    readonly id: number;
    readonly valueType: ValueType;

    constructor(
        private readonly name: string,
        private readonly scope: Scope,
        valueType: ValueType = 'number'
    ) {
        this.id = IdGenerator.generate();
        this.valueType = valueType;
    }

    evaluate(): T {
        const resolved = this.scope.get(this.name);
        if (!resolved || !(resolved instanceof Variable)) {
            throw new Error(`Variable "${this.name}" is not declared.`);
        }
        if (resolved.valueType !== this.valueType) {
            throw new Error(`Variable "${this.name}" type mismatch.`);
        }
        return resolved.evaluate() as T;
    }
}
