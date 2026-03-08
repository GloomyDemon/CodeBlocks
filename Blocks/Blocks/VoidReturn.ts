import type { IExecutable } from "../Interfaces/IExecutable.ts";
import { IdGenerator } from "../Program/IdGenerator.ts";
import { Scope } from "../Program/Scope.ts";
import { VoidReturnException } from "../Program/VoidReturnException.ts";

export class VoidReturn implements IExecutable {
    
    readonly #id: number;
    get id(): number {
        return this.#id;
    }

    readonly #scope: Scope;
    get scope(): Readonly<Scope> {
        return Object.freeze(this.#scope);
    }

    constructor(scope?: Scope) {
        this.#id = IdGenerator.generate();
        this.#scope = new Scope(scope);
    }

    execute(): void {
        throw new VoidReturnException();
    }

}