import { IdGenerator } from "../../../Program/IdGenerator.js";
export class Not {
    constructor(operand) {
        this.operand = operand;
        this.valueType = 'boolean';
        this.id = IdGenerator.generate();
    }
    evaluate() {
        return !this.operand.evaluate();
    }
}
