import { IdGenerator } from "../../../Program/IdGenerator.js";
export class Addition {
    constructor(left, right) {
        this.left = left;
        this.right = right;
        this.id = IdGenerator.generate();
        this.valueType = left.valueType;
    }
    evaluate() {
        const leftVal = this.left.evaluate();
        const rightVal = this.right.evaluate();
        if (typeof leftVal === 'number' && typeof rightVal === 'number') {
            return (leftVal + rightVal);
        }
        return (String(leftVal) + String(rightVal));
    }
}
