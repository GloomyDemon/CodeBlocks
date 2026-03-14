import type { IExecutable } from "../../../Interfaces/IExecutable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { Scope } from "../../../Program/Scope.js";
import type { Variable } from "../../Variable.js";
import { Subtraction } from "../Arithmetic/Subtraction.js";

export class SubtractionAssignment implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(
        private readonly target: Variable<number>,
        private readonly operand: Variable<number>,
        scope: Scope
    ) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        const op = new Subtraction(this.target, this.operand);
        this.target.change(op.evaluate());
    }
}
