import type { IEvaluable } from "../Interfaces/IEvaluable.js";
import type { INamed } from "../Interfaces/INamed.js";
import { IdGenerator } from "../Program/IdGenerator.js";
import type { ValueType } from "../Program/ValueType.js";

export class ArrayVariable<T> implements IEvaluable<readonly T[]>, INamed {
    readonly #id: number;
    get id(): number {
        return this.#id;
    }

    readonly #name: string;
    get name(): string {
        return this.#name;
    }

    readonly #elementType: ValueType;
    get elementType(): ValueType {
        return this.#elementType;
    }

    readonly valueType: ValueType = 'array';

    #values: T[];

    constructor(name: string, sizeOrValues: number | readonly T[], elementType: ValueType, fillValue?: T) {
        this.#id = IdGenerator.generate();
        this.#name = name;
        this.#elementType = elementType;
        if (typeof sizeOrValues === 'number') {
            this.#values = new Array<T>(sizeOrValues).fill(fillValue as T);
        } else {
            this.#values = [...sizeOrValues];
        }
    }

    evaluate(): readonly T[] {
        return this.#values;
    }

    length(): number {
        return this.#values.length;
    }

    getElement(index: number): T {
        this.ensureIndex(index);
        return this.#values[index]!;
    }

    setElement(index: number, value: T): void {
        this.ensureIndex(index);
        this.#values[index] = value;
    }

    change(values: readonly T[]): void {
        this.#values = [...values];
    }

    private ensureIndex(index: number): void {
        if (!Number.isInteger(index)) {
            throw new TypeError(`Index must be an integer. Got ${index}.`);
        }
        if (index < 0 || index >= this.#values.length) {
            throw new RangeError(`Index out of range: ${index}.`);
        }
    }
}
