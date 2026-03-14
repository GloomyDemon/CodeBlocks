import type { IExecutable } from "../../../Interfaces/IExecutable.js";
import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Scope } from "../../../Program/Scope.js";
import { Variable } from "../../Variable.js";

export class ScopedAssignment<T> implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(
        private readonly targetName: string,
        private readonly source: IEvaluable<T>,
        scope: Scope
    ) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        const resolved = this.scope.get(this.targetName);
        if (!resolved || !(resolved instanceof Variable)) {
            throw new Error(`Variable "${this.targetName}" is not declared.`);
        }
        resolved.change(this.source.evaluate() as never);
    }
}
