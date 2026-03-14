import type { IExecutable } from "../../../Interfaces/IExecutable.js";
import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Scope } from "../../../Program/Scope.js";
import { ArrayVariable } from "../../ArrayVariable.js";

export class ScopedElementAssignment<T> implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(
        private readonly arrayName: string,
        private readonly index: IEvaluable<number>,
        private readonly source: IEvaluable<T>,
        scope: Scope
    ) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        const resolved = this.scope.get(this.arrayName);
        if (!resolved || !(resolved instanceof ArrayVariable)) {
            throw new Error(`Array "${this.arrayName}" is not declared.`);
        }
        resolved.setElement(this.index.evaluate(), this.source.evaluate() as T);
    }
}
