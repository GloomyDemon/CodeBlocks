import type { IEvaluable } from "../Interfaces/IEvaluable.ts";
import { IdGenerator } from "../Program/IdGenerator.ts"; 

export class Variable<T> implements IEvaluable<T> {

    readonly #id: number;
    get id(): number {
        return this.#id;
    }
    
    readonly #name: string;
    get name(): string {
        return this.#name;
    }

    #value: T;
    evaluate(): T {
        return this.#value as T;
    }

    change(value: T): void {
        this.#value = value;
    }

    constructor(name: string, value: T = undefined as T) {
        this.#id = IdGenerator.generate();
        this.#name = name;
        this.#value = value;
    }
    
}
