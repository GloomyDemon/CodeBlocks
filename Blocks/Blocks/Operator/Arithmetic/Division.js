import { IdGenerator } from "../../../Program/IdGenerator.js";
export class Division {
    constructor(left, right) {
        this.left = left;
        this.right = right;
        this.valueType = 'number';
        this.id = IdGenerator.generate();
    }
    evaluate() {
        const rightVal = this.right.evaluate();
        if (rightVal === 0) {
            throw new Error('Division by zero');
        }
        return this.left.evaluate() / rightVal;
    }
}
