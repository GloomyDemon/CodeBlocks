import type { IEvaluable } from "../Interfaces/IEvaluable.ts";
import type { INamed } from "../Interfaces/INamed.ts";

export class Variable<T> implements INamed, IEvaluable<T> {
    readonly #id: string;
    readonly #name: string;
    #value: T;

    constructor(id: string, name: string, value: T) {
        this.#id = id;
        this.#name = name;
        this.#value = value;
    }

    get id(): string {
        return this.#id;
    }

    get name(): string {
        return this.#name;
    }

    evaluate(): T {
        return this.#value;
    }

    change(value: T): void {
        this.#value = value;
    }
}
