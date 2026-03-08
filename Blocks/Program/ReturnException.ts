import { VoidReturnException } from "./VoidReturnException.ts"

export class ReturnException<T> extends VoidReturnException {

    readonly #value: T;
    get value() {
        return this.#value;
    }

    constructor(value: T) {
        super();
        this.#value = value;
    }
}