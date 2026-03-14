import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Multiply } from "../Arithmetic/Multiply.js";
export class MultiplicationAssignment {
    constructor(target, operand, scope) {
        this.target = target;
        this.operand = operand;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const op = new Multiply(this.target, this.operand);
        this.target.change(op.evaluate());
    }
}
