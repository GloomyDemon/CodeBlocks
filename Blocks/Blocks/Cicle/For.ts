import type { IExecutable } from "../../Interfaces/IExecutable.ts";
import type { IContainer } from "../../Interfaces/IContainer.ts";
import { Scope } from "../../Program/Scope.ts";
import { IdGenerator } from "../../Program/IdGenerator.ts";
import type { IConditional } from "../../Interfaces/IConditional.ts";
import type { IEvaluable } from "../../Interfaces/IEvaluable.ts";
import type { Variable } from "../Variable.ts";
import { Container } from "../../Program/Container.ts";

export class For implements IExecutable, IContainer, IConditional {

    #variables: Container<Variable<unknown>> = new Container<Variable<unknown>>();
    get variables(): Readonly<Container<Variable<unknown>>> {
        return this.#variables;
    }
    
    condition: IEvaluable<boolean> | undefined;

    check(): boolean {
        if (this.condition) {
            return this.condition.evaluate();
        }
        return false;
    }

    #iterators: Container<IExecutable> = new Container<IExecutable>();
    get iterators(): Readonly<Container<IExecutable>> {
        return this.#iterators;
    }

    readonly #scope: Scope;
    get scope(): Readonly<Scope> {
        return Object.freeze(this.#scope);
    }

    readonly #id: number;
    get id(): number {
        return this.#id;
    }

    #blocks: Container<IExecutable> = new Container<IExecutable>();
    get blocks(): Readonly<Container<IExecutable>> {
        return this.#blocks;
    }

    constructor(parent: Scope) {
        this.#id = IdGenerator.generate();
        this.#scope = new Scope(parent);
    }

    execute(): void {
        while (this.check()) {
            this.#blocks.blocks.forEach(block => block.execute());
            this.#iterators.blocks.forEach(iterator => iterator.execute());
        }
    }

}