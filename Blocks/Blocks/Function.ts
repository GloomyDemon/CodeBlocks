import type { IEvaluable } from "../Interfaces/IEvaluable.ts";
import { ReturnException } from "../Program/ReturnException.ts";
import { VoidFunction } from "./VoidFunction.ts";

export class Function<T> extends VoidFunction implements IEvaluable<T> {
    
    evaluate(): T {
        for (const block of this.blocks) {
            try {
                block.execute();
            }
            catch(exception) {
                if (exception instanceof ReturnException) {
                    //PLZ FIX THIS TYPE CHECKING I BEGGING YOUUUU
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