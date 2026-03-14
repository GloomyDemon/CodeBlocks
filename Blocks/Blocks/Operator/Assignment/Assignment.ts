import type { IExecutable } from "../../../Interfaces/IExecutable.js";
import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { Scope } from "../../../Program/Scope.js";
import type { Variable } from "../../Variable.js";

export class Assignment<T> implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(
        private readonly target: Variable<T>,
        private readonly source: IEvaluable<T>,
        scope: Scope
    ) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        this.target.change(this.source.evaluate());
    }
}
