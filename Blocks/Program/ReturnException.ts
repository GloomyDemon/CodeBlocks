import { VoidReturnException } from "./VoidReturnException.js"
import type { ValueType } from "./ValueType.js";

export class ReturnException<T> extends VoidReturnException {

    readonly #value: T;
    get value() {
        return this.#value;
    }

    readonly #valueType: ValueType;
    get valueType(): ValueType {
        return this.#valueType;
    }

    constructor(value: T, valueType: ValueType) {
        super();
        this.#value = value;
        this.#valueType = valueType;
    }
}