import type { IEvaluable } from "../../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../../Program/IdGenerator.js";
import type { ValueType } from "../../../Program/ValueType.js";

export class Division implements IEvaluable<number> {
    readonly id: number;
    readonly valueType: ValueType = 'number';

    constructor(
        private readonly left: IEvaluable<number>,
        private readonly right: IEvaluable<number>
    ) {
        this.id = IdGenerator.generate();
    }

    evaluate(): number {
        const rightVal = this.right.evaluate();
        
        if (rightVal === 0) {
            throw new Error('Division by zero');
        }
        
        return this.left.evaluate() / rightVal;
    }
}
