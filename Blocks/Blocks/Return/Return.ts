import type { IEvaluable } from "../../Interfaces/IEvaluable.ts";
import { Scope } from "../../Program/Scope.ts";
import { VoidReturn } from "./VoidReturn.ts"
import { ReturnException } from "../../Program/ReturnException.ts";

export class Return<T> extends VoidReturn {
    
    readonly #returnBlock: IEvaluable<T>;
    get returnValue(): T {
        return this.#returnBlock.evaluate();
    }

    constructor(returnValue: IEvaluable<T>, scope?: Scope) {
        super(scope);
        this.#returnBlock = returnValue;
    }

    override execute(): void {
        throw new ReturnException<T>(this.returnValue, this.#returnBlock.valueType);
    }

}