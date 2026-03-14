import { IdGenerator } from "../../../Program/IdGenerator.js";
export class Remainder {
    constructor(left, right) {
        this.left = left;
        this.right = right;
        this.valueType = 'number';
        this.id = IdGenerator.generate();
    }
    evaluate() {
        return this.left.evaluate() % this.right.evaluate();
    }
}
