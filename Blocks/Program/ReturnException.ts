import { VoidReturnException } from "./VoidReturnException.ts"
import type { ValueType } from "./ValueType.ts";

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