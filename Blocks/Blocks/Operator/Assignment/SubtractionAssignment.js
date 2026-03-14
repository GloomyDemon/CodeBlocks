import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Subtraction } from "../Arithmetic/Subtraction.js";
export class SubtractionAssignment {
    constructor(target, operand, scope) {
        this.target = target;
        this.operand = operand;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const op = new Subtraction(this.target, this.operand);
        this.target.change(op.evaluate());
    }
}
