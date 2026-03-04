import type { IEvaluable } from "../Interfaces/IEvaluable.ts";
import { VoidFunction } from "./VoidFunction.js";

export class Function<T> extends VoidFunction implements IEvaluable<T> {
    /*evaluate(): T {
        this.execute();
        return this.();
        
    }*/
}