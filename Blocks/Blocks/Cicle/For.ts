import type { IExecutable } from "../../Interfaces/IExecutable.js";
import type { IContainer } from "../../Interfaces/IContainer.js";
import { Scope } from "../../Program/Scope.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { IConditional } from "../../Interfaces/IConditional.js";
import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import type { Variable } from "../Variable.js";
import { Container } from "../../Program/Container.js";

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

    #initializers: Container<IExecutable> = new Container<IExecutable>();
    get initializers(): Readonly<Container<IExecutable>> {
        return this.#initializers;
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
        for (const variable of this.#variables.blocks) {
            this.#scope.set(variable);
        }

        this.#initializers.blocks.forEach(block => block.execute());

        while (this.check()) {
            this.#blocks.blocks.forEach(block => block.execute());
            this.#iterators.blocks.forEach(iterator => iterator.execute());
        }
    }

}