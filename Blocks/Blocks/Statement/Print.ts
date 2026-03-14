import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import type { IExecutable } from "../../Interfaces/IExecutable.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { Scope } from "../../Program/Scope.js";
import type { Program } from "../../Program/Program.js";

export class Print implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(
        private readonly value: IEvaluable<unknown>,
        private readonly program: Program,
        scope: Scope
    ) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        this.program.writeOutput(this.value.evaluate(), this);
    }
}
