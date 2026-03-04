import type { IEvaluable } from "../Interfaces/IEvaluable.js";
import type { INamed } from "../Interfaces/INamed.js";

export class Variable<T> implements INamed, IEvaluable<T> {

    readonly #id: number;
    get id(): number {
        return this.#id;
    }
    
    readonly #name: string;
    get name(): string {
        return this.#name;
    }

    #value: T = null as any;
    evaluate(): T {
        return this.#value;
    }

    change(value: T): void {
        this.#value = value;
    }

    constructor(id: number, name: string, value?: T) {
        this.#id = id;
        this.#name = name;
        if (value) {
            this.#value = value;
        }
    }
    
}
