import type { IEvaluable } from "../../Interfaces/IEvaluable.ts";
import { ReturnException } from "../../Program/ReturnException.ts";
import type { ValueType } from "../../Program/ValueType.ts";
import { VoidFunction } from "./VoidFunction.ts";

export class Function<T> extends VoidFunction implements IEvaluable<T> {

    readonly #returnType: ValueType;
    get valueType(): ValueType {
        return this.#returnType;
    }

    constructor(name: string, returnType: ValueType) {
        super(name);
        this.#returnType = returnType;
    }
    
    evaluate(): T {
        for (const block of this.blocks.blocks) {
            try {
                block.execute();
            }
            catch(exception) {
                if (exception instanceof ReturnException) {
                    if (exception.valueType !== this.#returnType) {
                        throw new TypeError(
                            "Wrong return type.",
                            {
                                cause: `Function \"${this.name}\" expects ${this.#returnType}, got ${exception.valueType}.`
                            }
                        );
                    }
                    return exception.value as T;
                }
                throw new TypeError(
                    "Wrong return.",
                    {
                        cause: `Return type should be not void I think.`
                    }
                )
            }
        }
        throw new Error(
            `No return statement in function "${this.name}"`
        );
    }
    
}