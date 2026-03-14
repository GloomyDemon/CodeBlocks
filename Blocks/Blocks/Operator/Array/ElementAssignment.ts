import type { IExecutable } from "../../../Interfaces/IExecutable.js";
import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { Scope } from "../../../Program/Scope.js";
import { ArrayVariable } from "../../ArrayVariable.js";

export class ElementAssignment<T> implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(
        private readonly array: ArrayVariable<T>,
        private readonly index: IEvaluable<number>,
        private readonly source: IEvaluable<T>,
        scope: Scope
    ) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        const indexValue = this.index.evaluate();
        const nextValue = this.source.evaluate();
        this.array.setElement(indexValue, nextValue);
    }
}
