import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Division } from "../Arithmetic/Division.js";
export class DivisionAssignment {
    constructor(target, operand, scope) {
        this.target = target;
        this.operand = operand;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const op = new Division(this.target, this.operand);
        this.target.change(op.evaluate());
    }
}
