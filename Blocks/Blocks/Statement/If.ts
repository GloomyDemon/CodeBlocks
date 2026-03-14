import type { IExecutable } from "../../Interfaces/IExecutable.js";
import type { IContainer } from "../../Interfaces/IContainer.js";
import { Scope } from "../../Program/Scope.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { IConditional } from "../../Interfaces/IConditional.js";
import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import { Container } from "../../Program/Container.js";

export class If implements IExecutable, IContainer, IConditional {

    #blocks: Container<IExecutable> = new Container<IExecutable>();
    get blocks(): Readonly<Container<IExecutable>> {
        return this.#blocks;
    }
    
    condition: IEvaluable<boolean> | undefined;

    check(): boolean {
        if (this.condition) {
            return this.condition.evaluate();
        }
        return false;
    }

    readonly #scope: Scope;
    get scope(): Readonly<Scope> {
        return Object.freeze(this.#scope);
    }

    readonly #id: number;
    get id(): number {
        return this.#id;
    }

    constructor(parent: Scope) {
        this.#id = IdGenerator.generate();
        this.#scope = new Scope(parent);
    }

    execute(): void {
        if (this.check()) {
            this.#blocks.blocks.forEach(block => block.execute());
        };
    }

}