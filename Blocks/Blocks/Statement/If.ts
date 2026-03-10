import type { IExecutable } from "../../Interfaces/IExecutable.ts";
import type { IContainer } from "../../Interfaces/IContainer.ts";
import { Scope } from "../../Program/Scope.ts";
import { IdGenerator } from "../../Program/IdGenerator.ts";
import type { IConditional } from "../../Interfaces/IConditional.ts";
import type { IEvaluable } from "../../Interfaces/IEvaluable.ts";
import { Container } from "../../Program/Container.ts";

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