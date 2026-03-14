import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Exponentiation } from "../Arithmetic/Exponentiation.js";
export class ExponentiationAssignment {
    constructor(target, operand, scope) {
        this.target = target;
        this.operand = operand;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const op = new Exponentiation(this.target, this.operand);
        this.target.change(op.evaluate());
    }
}
