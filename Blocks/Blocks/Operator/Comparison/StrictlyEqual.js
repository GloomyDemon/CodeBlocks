import { IdGenerator } from "../../../Program/IdGenerator.js";
export class StrictlyEqual {
    constructor(left, right) {
        this.left = left;
        this.right = right;
        this.valueType = 'boolean';
        this.id = IdGenerator.generate();
    }
    evaluate() {
        return this.left.evaluate() === this.right.evaluate();
    }
}
