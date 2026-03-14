import type { IExecutable } from "../../../Interfaces/IExecutable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { Scope } from "../../../Program/Scope.js";
import type { Variable } from "../../Variable.js";
import { Addition } from "../Arithmetic/Addition.js";

export class AdditionAssignment implements IExecutable {
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
        const addOp = new Addition<number>(this.target, this.operand);
        this.target.change(addOp.evaluate());
    }
}
