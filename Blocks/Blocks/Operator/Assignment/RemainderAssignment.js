import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Remainder } from "../Arithmetic/Remainder.js";
export class RemainderAssignment {
    constructor(target, operand, scope) {
        this.target = target;
        this.operand = operand;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const op = new Remainder(this.target, this.operand);
        this.target.change(op.evaluate());
    }
}
